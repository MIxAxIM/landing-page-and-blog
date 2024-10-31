import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useTask } from "~/hooks/contribution/useTask";
import { useEscrow } from "~/hooks/contribution/useEscrow";
import { Form } from "~/components/ui/form";
import DialogForm from "~/components/form/dialog-form";
import FormInput from "~/components/form/form-input";
import FormTextArea from "~/components/form/form-textarea";
import FormSelect from "~/components/form/form-select";
import { TaskStatus } from "@prisma/client";
import useTreasuries from "~/hooks/contribution/useTreasuries";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  acceptanceCriteria: z
    .array(z.string())
    .min(1, "At least one acceptance criterion is required"),
  treasuryId: z.string().min(1, "Treasury is required"),
  escrowId: z.string().min(1, "Escrow is required"),
});

type FormValues = z.infer<typeof FormSchema>;

export default function DialogTask({
  id,
  escrowId: defaultEscrowId,
  treasuryId: defaultTreasuryId,
}: {
  id?: string;
  escrowId?: string;
  treasuryId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTreasuryId, setSelectedTreasuryId] = useState(
    defaultTreasuryId ?? "",
  );
  const isEditMode = !!id;

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      acceptanceCriteria: [""],
      treasuryId: defaultTreasuryId ?? "",
      escrowId: defaultEscrowId ?? "",
    },
  });

  const {
    task,
    createTask,
    updateTask,
    isCreating,
    isUpdating,
    isLoading: isTaskLoading,
  } = useTask({ id, treasuryNftPolicyId: defaultTreasuryId });

  // Get available treasuries
  const { treasuries, isLoadingTreasuries } = useTreasuries();

  // Get list of available escrows
  const { escrows, isLoading: isLoadingEscrows } = useEscrow({});

  // Filter escrows based on selected treasury
  const filteredEscrows = escrows.filter(
    (escrow) => escrow.treasuryId === selectedTreasuryId,
  );

  // Handle treasury selection change
  useEffect(() => {
    const treasurySubscription = form.watch((value, { name }) => {
      if (name === "treasuryId") {
        setSelectedTreasuryId(value.treasuryId ?? "");
        if (!defaultEscrowId) {
          form.setValue("escrowId", "");
        }
      }
    });

    return () => treasurySubscription.unsubscribe();
  }, [form, defaultEscrowId]);

  // Update form when task data is loaded
  useEffect(() => {
    if (task && isEditMode) {
      const treasuryId = task.escrow?.treasuryId ?? "";
      setSelectedTreasuryId(treasuryId);
      form.reset({
        title: task.title,
        description: task.description,
        acceptanceCriteria: task.acceptanceCriteria,
        treasuryId,
        escrowId: task.escrowId,
      });
    }
  }, [task, form, isEditMode]);

  const onSubmit = async (data: FormValues) => {
    if (isEditMode && id) {
      updateTask({
        id,
        title: data.title,
        description: data.description,
        acceptanceCriteria: data.acceptanceCriteria,
      });
    } else {
      createTask({
        escrowId: data.escrowId,
        task: {
          title: data.title,
          description: data.description,
          acceptanceCriteria: data.acceptanceCriteria,
          status: TaskStatus.DRAFT,
        },
      });
    }
    setIsOpen(false);
    form.reset();
    setSelectedTreasuryId("");
  };

  // Dynamic acceptance criteria field handling
  const acceptanceCriteria = form.watch("acceptanceCriteria");

  const addCriterion = () => {
    form.setValue("acceptanceCriteria", [...acceptanceCriteria, ""]);
  };

  const removeCriterion = (index: number) => {
    const newCriteria = acceptanceCriteria.filter((_, i) => i !== index);
    form.setValue("acceptanceCriteria", newCriteria);
  };

  const isLoading =
    isCreating || isUpdating || isLoadingEscrows || isLoadingTreasuries;

  return (
    <Form {...form}>
      <DialogForm
        openButton={isEditMode ? "Edit Task" : "Create Task"}
        openButtonIntent="default"
        icon={isEditMode ? "pencil" : "plus"}
        title={isEditMode ? "Edit Task" : "Create New Task"}
        description={
          isEditMode
            ? "Update the task's details."
            : "Create a new task by selecting a treasury and escrow, then providing task details."
        }
        buttonLabel={isEditMode ? "Save Changes" : "Create Task"}
        buttonLoading={isLoading}
        buttonDisabled={isLoading}
        handleSubmit={form.handleSubmit(onSubmit)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <div className="grid gap-4 py-4">
          {!id && (
            <>
              <FormSelect
                name="treasuryId"
                label="Treasury"
                form={form}
                options={
                  treasuries?.map((t) => ({
                    value: t.treasuryNftPolicyId,
                    label: t.title,
                  })) ?? []
                }
                placeholder="Select a treasury"
                disabled={!!defaultTreasuryId}
              />

              <FormSelect
                name="escrowId"
                label="Escrow"
                form={form}
                options={
                  filteredEscrows.map((e) => ({
                    value: e.id,
                    label: e.title,
                  })) ?? []
                }
                placeholder="Select an escrow"
              />
            </>
          )}

          <FormInput
            name="title"
            label="Task Title"
            form={form}
            placeholder="Enter a title for this task"
          />

          <FormTextArea
            name="description"
            label="Description"
            form={form}
            placeholder="Enter task description"
            height={150}
          />

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Acceptance Criteria
            </label>
            {acceptanceCriteria.map((criterion, index) => (
              <div key={index} className="flex gap-2">
                <FormInput
                  name={`acceptanceCriteria.${index}`}
                  form={form}
                  placeholder={`Criterion ${index + 1}`}
                />
                {acceptanceCriteria.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCriterion(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addCriterion}
              className="text-blue-500 hover:text-blue-700"
            >
              Add Criterion
            </button>
          </div>
        </div>
      </DialogForm>
    </Form>
  );
}
