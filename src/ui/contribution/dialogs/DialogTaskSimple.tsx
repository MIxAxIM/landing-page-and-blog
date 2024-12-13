import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useTask } from "~/hooks/db/contribution/useTask";
import { Form } from "~/components/ui/form";
import DialogForm from "~/components/form/dialog-form";
import FormInput from "~/components/form/form-input";
import FormTextArea from "~/components/form/form-textarea";
import { TaskStatus } from "@prisma/client";
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
import { Task, type Escrow } from "~/types/db";
import { useTerminology } from "~/contexts/terminology-context";

// Validation constants
const MIN_ADA = 10;
const MIN_HOURS_FUTURE = 168;

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
    .array(z.string())
    .transform((criteria) => criteria.filter((c) => c.trim() !== ""))
    .refine(
      (criteria) => criteria.length >= 1,
      "At least one criterion must be provided",
    ),
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

const TaskDisplay = ({ task }: { task: Task }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3>Title</h3>
        <p>{task.title}</p>
      </div>
      <div>
        <h3>Description</h3>
        <p className="whitespace-pre-wrap">{task.description}</p>
      </div>
      <div>
        <h3>Acceptance Criteria</h3>
        <ul className="list-disc pl-5">
          {task.acceptanceCriteria.map((criterion, index) => (
            <li key={index}>{criterion}</li>
          ))}
        </ul>
      </div>
      {task.taskHash && (
        <div>
          <h3>Task Hash</h3>
          <code className="block break-all rounded bg-muted p-2 text-xs">
            {task.taskHash}
          </code>
        </div>
      )}
      {task.hash && (
        <div>
          <h3>Network Hash</h3>
          <code className="block break-all rounded bg-muted p-2 text-xs">
            {task.hash}
          </code>
        </div>
      )}
      <div>
        <h3>Status</h3>
        <p>{task.status}</p>
      </div>
      <div>
        <h3>Reward</h3>
        <p>{parseInt(task.lovelace) / 1_000_000} ADA</p>
      </div>
      <div>
        <h3>Expiration</h3>
        <p>{format(new Date(parseInt(task.expirationTime)), "PPP")}</p>
      </div>
    </div>
  );
};

interface TaskDialogProps {
  id?: string;
  treasuryId: string;
  escrow: Escrow;
  openButtonSize?: "sm" | "lg";
}

export default function DialogTaskSimple({
  id,
  treasuryId,
  escrow,
  openButtonSize,
}: TaskDialogProps) {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [hasLoadedCriteria, setHasLoadedCriteria] = useState(false);

  const isEditMode = !!id;

  // Custom hooks
  const {
    task,
    createTask,
    updateTask,
    revertToDraftFromApproved,
    isCreating,
    isUpdating,
  } = useTask({ id: id, treasuryNftPolicyId: treasuryId });

  const { translate, translateCaps, translatePlural } = useTerminology()

  // Form initialization with proper typing
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      acceptanceCriteria: [""],
      ada: MIN_ADA,
      expirationTime: getMinDate(),
    },
  });

  // Effect: Handle specified escrow on open
  useEffect(() => {
    if (!!escrow && isOpen && !hasLoadedCriteria) {
      if (escrow?.savedAcceptanceCriteria?.length) {
        form.setValue(
          "acceptanceCriteria",
          escrow.savedAcceptanceCriteria.filter(
            (criteria) => criteria.trim() !== "",
          ),
          { shouldValidate: true },
        );
        setHasLoadedCriteria(true);
      }
    }
  }, [escrow, isOpen, hasLoadedCriteria]);

  // Effect: Load task data in edit mode
  useEffect(() => {
    if (task && isEditMode && isOpen) {

      form.reset({
        title: task.title,
        description: task.description,
        acceptanceCriteria: task.acceptanceCriteria,
        ada: parseInt(task.lovelace) / 1000000,
        expirationTime: new Date(parseInt(task.expirationTime)),
      });
    }
  }, [task, isEditMode, isOpen]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setHasLoadedCriteria(false);
    }
  }, [isOpen]);

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
    if (!isEditMode) return "Create New Task in " + escrow.title;
    if (!task) return "Create New Task in " + escrow.title;

    const statusTitles = {
      [TaskStatus.DRAFT]: "Edit Task",
      [TaskStatus.APPROVED]: "View Approved Task",
      [TaskStatus.PENDING_TX]: "Task is Awaiting On-Chain Confirmation",
      [TaskStatus.ON_CHAIN]: "View On-Chain Task",
      [TaskStatus.BACKLOG]: "Task is in backlog",
      [TaskStatus.ARCHIVED]: "Task is archived",
    };
    return statusTitles[task.status] || "View Task";
  };

  const getDialogDescription = () => {
    if (!isEditMode) {
      return `Create a new task by selecting the ${translateCaps('treasury')} and a ${translateCaps('escrow')}. Then, provide ${translateCaps('task')} details. This is a draft, and you will be able to change these details later.`;
    }
    if (!task) return "";

    if (task.status === TaskStatus.DRAFT) {
      return "Update details.";
    }

    if (task.status === TaskStatus.APPROVED) {
      return `This ${translate('task')} is already approved. You must revert it to draft status to make changes.`;
    }

    return `This ${translate('task')} cannot be edited in its current status.`;
  };

  // Form submission handler
  const handleSubmit = async (data: FormValues) => {
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        acceptanceCriteria: data.acceptanceCriteria.filter(
          (c) => c.trim() !== "",
        ),
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
          escrowId: escrow.id,
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
    isCreating || isUpdating;

  return (
    <Form {...form}>
      <DialogForm
        openButton={!!id ? "Edit Task" : "Draft a new task"}
        openButtonIntent="default"
        openButtonSize={openButtonSize}
        icon={isEditMode ? "pencil" : "plus"}
        title={getDialogTitle()}
        description={getDialogDescription()}
        buttonLabel={isEditMode ? "Save Changes" : "Save Draft"}
        buttonLoading={isLoading}
        buttonDisabled={isLoading}
        handleSubmit={form.handleSubmit(handleSubmit)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        {(!task || task.status === TaskStatus.DRAFT) && (

          <div className="grid gap-4 py-4">
            <p>in {escrow.title}</p>
            <div className="grid grid-cols-4 gap-5">
              {!!escrow ? (
                <>
                  <div className="col-span-3">
                    <FormInput
                      name="title"
                      label={`${translateCaps('task')} Title`}
                      form={form}
                      placeholder={`Enter a title for this ${translate('task')}`}
                      disabled={isLoading}
                    />

                    <FormTextArea
                      name="description"
                      label="Description"
                      form={form}
                      placeholder="Enter description"
                      height={150}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex w-full flex-col space-y-2">
                    <FormInput
                      name="ada"
                      label="Ada Reward"
                      type="number"
                      min={MIN_ADA}
                      max={1000000}
                      form={form}
                      disabled={isLoading}
                    />
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
                          className="z-50 w-auto p-0"
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


                    {(escrow.savedAcceptanceCriteria?.length ?? 0) > 0 && (
                      <Alert>
                        <AlertTitle>Saved Criteria Loaded</AlertTitle>
                        <AlertDescription>
                          {translateCaps('acceptanceCriteria')} have been pre-loaded from the
                          selected {translate('escrow')}. You can modify or remove them as
                          needed.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="col-span-4 mt-5 pt-5 border-t border-primary">

                    <label className="block text-sm font-medium text-gray-700">
                      Acceptance Criteria
                    </label>
                    <div className="flex w-full flex-col">
                      {acceptanceCriteria.map((_criterion, index) => (
                        <div
                          key={index}
                          className="flex w-full items-center justify-between gap-2"
                        >
                          <div className="flex-1">
                            <FormInput
                              name={`acceptanceCriteria.${index}`}
                              form={form}
                              placeholder={`Criterion ${index + 1}`}
                              disabled={isLoading}
                            />
                          </div>
                          {acceptanceCriteria.length > 1 && (
                            <Button
                              type="button"
                              intent="destructive"
                              size="sm"
                              onClick={() => handleRemoveCriterion(index)}
                              disabled={isLoading}
                            >
                              X
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      intent="secondary"
                      size="sm"
                      onClick={handleAddCriterion}
                      disabled={isLoading}
                      className="my-3"
                    >
                      Add Acceptance Criterion
                    </Button>
                  </div>
                </>
              ) : (
                <p>No {translatePlural('escrow')}. Please make one first.</p>
              )}
            </div>
          </div>
        )}
        {!!task && task.status != TaskStatus.DRAFT && <>

          <div className="space-y-4">
            <TaskDisplay task={task} />
            {task?.status === TaskStatus.APPROVED && (
              <>
                <Alert>
                  <AlertTitle>{translateCaps('task')} is locked</AlertTitle>
                  <AlertDescription>
                    This {translate('task')} is approved and its content is locked. To make
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


        </>}
      </DialogForm>
    </Form>
  );
}
