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
import { posixTimeByHoursFromNow } from "~/utils/time";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "~/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";

// Validation constants
const MIN_ADA = 2;
const MIN_HOURS_FUTURE = 48;

// Enhanced schema with better error messages and validation
const FormSchema = z.object({
  title: z.string().min(1, "Please enter a task title"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters long"),
  acceptanceCriteria: z
    .array(z.string().min(1, "Criterion cannot be empty"))
    .min(1, "At least one acceptance criterion is required"),
  treasuryId: z.string().min(1, "Please select a treasury"),
  escrowId: z.string().min(1, "Please select an escrow"),
  ada: z
    .number()
    .min(MIN_ADA, `Minimum ${MIN_ADA} Ada required`)
    .max(1000000, "Maximum 1,000,000 Ada allowed"),
  expirationTime: z
    .number()
    .min(
      posixTimeByHoursFromNow(MIN_HOURS_FUTURE),
      `Expiration time must be at least ${MIN_HOURS_FUTURE} hours in the future`,
    ),
});

type FormValues = z.infer<typeof FormSchema>;

interface TaskDialogProps {
  id?: string;
  escrowId?: string;
  treasuryId?: string;
}

export default function DialogTask({
  id,
  escrowId: defaultEscrowId,
  treasuryId: defaultTreasuryId,
}: TaskDialogProps) {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTreasuryId, setSelectedTreasuryId] = useState(
    defaultTreasuryId ?? "",
  );
  const [taskExpirationTime, setTaskExpirationTime] = useState<Date>();
  const isEditMode = !!id;

  // Custom hooks
  const {
    task,
    createTask,
    updateTask,
    isCreating,
    isUpdating,
    isLoading: isTaskLoading,
  } = useTask({ id, treasuryNftPolicyId: defaultTreasuryId });

  const { treasuries, isLoadingTreasuries } = useTreasuries();
  const { escrows, isLoading: isLoadingEscrows } = useEscrow({});

  // Form initialization
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      acceptanceCriteria: [""],
      treasuryId: defaultTreasuryId ?? "",
      escrowId: defaultEscrowId ?? "",
      ada: MIN_ADA,
      expirationTime: posixTimeByHoursFromNow(MIN_HOURS_FUTURE),
    },
  });

  // Filtered escrows based on selected treasury
  const filteredEscrows = escrows
    .filter((escrow) => escrow?.treasuryId === selectedTreasuryId)
    .filter(Boolean);

  // Effect: Handle treasury selection change
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

  // Effect: Load task data in edit mode
  useEffect(() => {
    if (task && isEditMode) {
      const treasuryId = task.escrow?.treasuryId ?? "";
      setSelectedTreasuryId(treasuryId);

      form.reset({
        title: task.title,
        description: task.description,
        acceptanceCriteria: task.acceptanceCriteria,
        ada: parseInt(task.lovelace) / 1000000,
        expirationTime: parseInt(task.expirationTime),
        treasuryId,
        escrowId: task.escrowId,
      });

      setTaskExpirationTime(new Date(parseInt(task.expirationTime)));
    }
  }, [task, form, isEditMode]);

  // Handlers for acceptance criteria
  const acceptanceCriteria = form.watch("acceptanceCriteria");

  const handleAddCriterion = () => {
    form.setValue("acceptanceCriteria", [...acceptanceCriteria, ""]);
  };

  const handleRemoveCriterion = (index: number) => {
    const newCriteria = acceptanceCriteria.filter((_, i) => i !== index);
    form.setValue("acceptanceCriteria", newCriteria);
  };

  // Form submission handler
  const handleSubmit = async (data: FormValues) => {
    if (!taskExpirationTime) {
      form.setError("expirationTime", {
        type: "manual",
        message: "Please select an expiration date",
      });
      return;
    }

    const taskData = {
      title: data.title,
      description: data.description,
      acceptanceCriteria: data.acceptanceCriteria,
      lovelace: (data.ada * 1000000).toString(),
      expirationTime: taskExpirationTime.getTime().toString(),
    };

    try {
      if (isEditMode && id) {
        updateTask({
          id,
          ...taskData,
        });
      } else {
        createTask({
          escrowId: data.escrowId,
          task: {
            ...taskData,
            status: TaskStatus.DRAFT,
          },
        });
      }
      setIsOpen(false);
      form.reset();
      setSelectedTreasuryId("");
    } catch (error) {
      console.error("Failed to submit task:", error);
    }
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
        handleSubmit={form.handleSubmit(handleSubmit)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <div className="grid gap-4 py-4">
          {!isEditMode && (
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
                options={filteredEscrows.map((e) => ({
                  value: e?.id ?? "",
                  label: e?.title ?? "",
                }))}
                placeholder="Select an escrow"
                disabled={!selectedTreasuryId}
              />
            </>
          )}

          <FormInput
            name="title"
            label="Task Title"
            form={form}
            placeholder="Enter a title for this task"
          />

          <FormInput
            name="ada"
            label="Ada Reward"
            type="number"
            min={MIN_ADA}
            max={1000000}
            form={form}
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
                  <Button
                    type="button"
                    intent="destructive"
                    size="sm"
                    onClick={() => handleRemoveCriterion(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              intent="secondary"
              size="sm"
              onClick={handleAddCriterion}
            >
              Add Criterion
            </Button>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button intent="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {taskExpirationTime ? (
                  format(taskExpirationTime, "PPP")
                ) : (
                  <span>Select Expiration Date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="mx-auto flex w-full justify-center">
                <Calendar
                  mode="single"
                  selected={taskExpirationTime}
                  onSelect={setTaskExpirationTime}
                  initialFocus
                  disabled={(date) =>
                    date <
                    new Date(Date.now() + MIN_HOURS_FUTURE * 60 * 60 * 1000)
                  }
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </DialogForm>
    </Form>
  );
}
