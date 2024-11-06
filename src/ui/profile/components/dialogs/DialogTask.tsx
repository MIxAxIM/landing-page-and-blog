import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { type ExtendedTask, useTask } from "~/hooks/contribution/useTask";
import { useEscrow } from "~/hooks/contribution/useEscrow";
import { Form } from "~/components/ui/form";
import DialogForm from "~/components/form/dialog-form";
import FormInput from "~/components/form/form-input";
import FormTextArea from "~/components/form/form-textarea";
import FormSelect from "~/components/form/form-select";
import { TaskStatus } from "@prisma/client";
import useTreasuries from "~/hooks/contribution/useTreasuries";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "~/components/ui/calendar";
import { format, startOfDay } from "date-fns";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

// Validation constants
const MIN_ADA = 2;
const MIN_HOURS_FUTURE = 48;

// Get minimum valid date
const getMinDate = () => {
  const date = new Date();
  date.setHours(date.getHours() + MIN_HOURS_FUTURE);
  return startOfDay(date);
};

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
    .date()
    .min(
      getMinDate(),
      `Must be at least ${MIN_HOURS_FUTURE} hours in the future`,
    ),
});

type FormValues = z.infer<typeof FormSchema>;

const TaskDisplay = ({ task }: { task: ExtendedTask }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">Title</h3>
        <p>{task.title}</p>
      </div>
      <div>
        <h3 className="font-medium">Description</h3>
        <p className="whitespace-pre-wrap">{task.description}</p>
      </div>
      <div>
        <h3 className="font-medium">Acceptance Criteria</h3>
        <ul className="list-disc pl-5">
          {task.acceptanceCriteria.map((criterion, index) => (
            <li key={index}>{criterion}</li>
          ))}
        </ul>
      </div>
      {task.hash && (
        <div>
          <h3 className="font-medium">Content Hash</h3>
          <code className="block break-all rounded bg-muted p-2 text-xs">
            {task.hash}
          </code>
        </div>
      )}
      <div>
        <h3 className="font-medium">Status</h3>
        <p>{task.status}</p>
      </div>
      <div>
        <h3 className="font-medium">Reward</h3>
        <p>{parseInt(task.lovelace) / 1_000_000} ADA</p>
      </div>
      <div>
        <h3 className="font-medium">Expiration</h3>
        <p>{format(new Date(parseInt(task.expirationTime)), "PPP")}</p>
      </div>
    </div>
  );
};

interface TaskDialogProps {
  id?: string;
  escrowId?: string;
  treasuryId?: string;
  openButtonSize?: "sm" | "lg";
}

export default function DialogTask({
  id,
  escrowId: defaultEscrowId,
  treasuryId: defaultTreasuryId,
  openButtonSize,
}: TaskDialogProps) {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTreasuryId, setSelectedTreasuryId] = useState(
    defaultTreasuryId ?? "",
  );

  const isEditMode = !!id;

  // Custom hooks
  const {
    task,
    createTask,
    updateTask,
    revertToDraftFromApproved,
    isCreating,
    isUpdating,
  } = useTask({ id, treasuryNftPolicyId: defaultTreasuryId });

  const { treasuries, isLoadingTreasuries } = useTreasuries();
  const { escrows, isLoading: isLoadingEscrows } = useEscrow({});

  // Form initialization with proper typing
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      acceptanceCriteria: [""],
      treasuryId: defaultTreasuryId ?? "",
      escrowId: defaultEscrowId ?? "",
      ada: MIN_ADA,
      expirationTime: getMinDate(),
    },
  });

  // Filtered escrows based on selected treasury
  const filteredEscrows = escrows
    .filter((escrow) => escrow?.treasuryId === selectedTreasuryId)
    .filter((escrow): escrow is NonNullable<typeof escrow> => escrow !== null);

  // Effect: Handle treasury selection change
  useEffect(() => {
    if (!isOpen) return;

    const treasurySubscription = form.watch((value, { name }) => {
      if (name === "treasuryId") {
        setSelectedTreasuryId(value.treasuryId ?? "");
        if (!defaultEscrowId) {
          form.setValue("escrowId", "");
        }
      }
    });

    return () => treasurySubscription.unsubscribe();
  }, [form, defaultEscrowId, isOpen]);

  // Effect: Load task data in edit mode
  useEffect(() => {
    if (task && isEditMode && isOpen) {
      const treasuryId = task.escrow?.treasuryId ?? "";
      setSelectedTreasuryId(treasuryId);

      form.reset({
        title: task.title,
        description: task.description,
        acceptanceCriteria: task.acceptanceCriteria,
        ada: parseInt(task.lovelace) / 1000000,
        expirationTime: new Date(parseInt(task.expirationTime)),
        treasuryId,
        escrowId: task.escrowId,
      });
    }
  }, [task, form, isEditMode, isOpen]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      if (!defaultTreasuryId) {
        setSelectedTreasuryId("");
      }
    }
  }, [isOpen, form, defaultTreasuryId]);

  // Add this effect after the other useEffect hooks
  useEffect(() => {
    if (defaultTreasuryId && treasuries) {
      const treasury = treasuries.find(
        (t) => t.treasuryNftPolicyId === defaultTreasuryId,
      );
      if (treasury) {
        form.setValue("treasuryId", treasury.treasuryNftPolicyId);
        setSelectedTreasuryId(treasury.treasuryNftPolicyId);
      }
    }
  }, [defaultTreasuryId, treasuries, form]);

  // Handlers for acceptance criteria
  const acceptanceCriteria = form.watch("acceptanceCriteria");

  const handleAddCriterion = () => {
    const newCriteria = [...acceptanceCriteria, ""];
    form.setValue("acceptanceCriteria", newCriteria, {
      shouldValidate: true,
    });
  };

  const handleRemoveCriterion = (index: number) => {
    const newCriteria = acceptanceCriteria.filter((_, i) => i !== index);
    form.setValue("acceptanceCriteria", newCriteria, {
      shouldValidate: true,
    });
  };

  const handleRevertToDraft = () => {
    if (!id) return;
    revertToDraftFromApproved(id);
  };

  const getDialogTitle = () => {
    if (!isEditMode) return "Create New Task";
    if (!task) return "View Task";

    const statusTitles = {
      [TaskStatus.DRAFT]: "Edit Task",
      [TaskStatus.APPROVED]: "View Approved Task",
      [TaskStatus.ON_CHAIN]: "View On-Chain Task",
      [TaskStatus.COMMITMENT_MADE]: "View Task Commitment",
      [TaskStatus.COMPLETE]: "View Completed Task",
    };
    return statusTitles[task.status] || "View Task";
  };

  const getDialogDescription = () => {
    if (!isEditMode) {
      return "Create a new task by selecting a treasury and escrow, then providing task details.";
    }
    if (!task) return "";

    if (task.status === TaskStatus.DRAFT) {
      return "Update the task's details.";
    }

    if (task.status === TaskStatus.APPROVED) {
      return "This task is approved. You must revert it to draft status to make changes.";
    }

    return "This task cannot be edited in its current status.";
  };

  // Form submission handler
  const handleSubmit = async (data: FormValues) => {
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        acceptanceCriteria: data.acceptanceCriteria,
        lovelace: (data.ada * 1000000).toString(),
        expirationTime: data.expirationTime.getTime().toString(),
      };

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
    } catch (error) {
      console.error("Failed to submit task:", error);
    }
  };

  const isLoading =
    isCreating || isUpdating || isLoadingEscrows || isLoadingTreasuries;

  return (
    <Form {...form}>
      <DialogForm
        openButton={isEditMode ? "Edit Task" : "Draft a new task"}
        openButtonIntent="default"
        openButtonSize={openButtonSize}
        icon={isEditMode ? "pencil" : "plus"}
        title={getDialogTitle()}
        description={getDialogDescription()}
        buttonLabel={isEditMode ? "Save Changes" : "Create Task"}
        buttonLoading={isLoading}
        buttonDisabled={isLoading}
        handleSubmit={form.handleSubmit(handleSubmit)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <div className="grid gap-4 py-4">
          {!task || task.status === TaskStatus.DRAFT ? (
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
                disabled={!!defaultTreasuryId || isLoading}
              />
              {selectedTreasuryId && filteredEscrows.length > 0 ? (
                <>
                  <FormSelect
                    name="escrowId"
                    label="Escrow"
                    form={form}
                    options={filteredEscrows.map((e) => ({
                      value: e.id,
                      label: e.title,
                    }))}
                    placeholder="Select an escrow"
                    disabled={!selectedTreasuryId || isLoading}
                  />
                  <FormInput
                    name="title"
                    label="Task Title"
                    form={form}
                    placeholder="Enter a title for this task"
                    disabled={isLoading}
                  />

                  <FormInput
                    name="ada"
                    label="Ada Reward"
                    type="number"
                    min={MIN_ADA}
                    max={1000000}
                    form={form}
                    disabled={isLoading}
                  />

                  <FormTextArea
                    name="description"
                    label="Description"
                    form={form}
                    placeholder="Enter task description"
                    height={150}
                    disabled={isLoading}
                  />

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Acceptance Criteria
                    </label>
                    {acceptanceCriteria.map((_criterion, index) => (
                      <div key={index} className="flex gap-2">
                        <FormInput
                          name={`acceptanceCriteria.${index}`}
                          form={form}
                          placeholder={`Criterion ${index + 1}`}
                          disabled={isLoading}
                        />
                        {acceptanceCriteria.length > 1 && (
                          <Button
                            type="button"
                            intent="destructive"
                            size="sm"
                            onClick={() => handleRemoveCriterion(index)}
                            disabled={isLoading}
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
                      disabled={isLoading}
                    >
                      Add Criterion
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Expiration Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button intent="outline" disabled={isLoading}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.watch("expirationTime") ? (
                            format(form.watch("expirationTime"), "PPP")
                          ) : (
                            <span>Select Expiration Date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                      >
                        <div onClick={(e) => e.stopPropagation()}>
                          <Calendar
                            mode="single"
                            selected={form.watch("expirationTime")}
                            onSelect={(date) => {
                              if (date) {
                                form.setValue("expirationTime", date, {
                                  shouldValidate: true,
                                });
                              }
                            }}
                            disabled={(date) => date < getMinDate()}
                            initialFocus
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    {form.formState.errors.expirationTime && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.expirationTime.message}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p>No escrows. Please make one first.</p>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <TaskDisplay task={task} />
              {task.status === TaskStatus.APPROVED && (
                <>
                  <Alert>
                    <AlertTitle>Task is locked</AlertTitle>
                    <AlertDescription>
                      This task is approved and its content is locked. To make
                      changes, you must first revert it to draft status.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={handleRevertToDraft}
                    disabled={isUpdating}
                    className="w-full"
                  >
                    Revert to Draft
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </DialogForm>
    </Form>
  );
}
