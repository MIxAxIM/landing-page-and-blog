import { useCallback, useMemo } from "react";
import { useTask } from "~/hooks/db/contribution/useTask";
import { Form } from "~/components/ui/form";
import DialogForm from "~/components/form/dialog-form";
import { TaskStatus } from "@prisma/client";
import { type Escrow } from "~/types/db";
import { useTerminology } from "~/contexts/terminology-context";
import { useTaskForm } from "./useTaskForm";
import { TaskFormView, TaskDisplayView } from "./components";

interface TaskDialogProps {
  id?: string;
  treasuryId: string;
  escrow: Escrow;
  openButtonSize?: "sm" | "lg";
}

export default function DialogTaskNew({
  id,
  treasuryId,
  escrow,
  openButtonSize,
}: TaskDialogProps) {
  const { translate, translateCaps } = useTerminology();
  const isEditMode = !!id;

  // Task management
  const {
    task,
    createTask,
    updateTask,
    revertToDraftFromApproved,
    isCreating,
    isUpdating,
  } = useTask({
    id,
    treasuryNftPolicyId: treasuryId
  });

  // Form management
  const {
    form,
    isOpen,
    setIsOpen,
    handleSubmit,
  } = useTaskForm({
    task,
    escrow,
    isEditMode,
    createTask,
    updateTask
  });

  // Handlers
  const handleRevertToDraft = useCallback(() => {
    if (!id) return;
    revertToDraftFromApproved(id);
  }, [id, revertToDraftFromApproved]);

  // Computed values
  // In the main DialogTaskSimple component
  const dialogTitle = useMemo(() => {
    if (!isEditMode) return `Create New Task in ${escrow.title}`;
    if (!task) return `Create New Task in ${escrow.title}`;

    // Create a complete mapping for all TaskStatus values
    const statusTitles: Record<TaskStatus, string> = {
      [TaskStatus.DRAFT]: "Edit Task",
      [TaskStatus.APPROVED]: "View Approved Task",
      [TaskStatus.PENDING_TX]: "Task is Awaiting On-Chain Confirmation",
      [TaskStatus.ON_CHAIN]: "View On-Chain Task",
      [TaskStatus.COMMITMENT_MADE]: "View Task Commitment",
      [TaskStatus.COMMITMENT_DENIED]: "Task has been denied",
      [TaskStatus.COMMITMENT_ACCEPTED]: "Task commitment has been accepted and task is complete",
      [TaskStatus.BACKLOG]: "Task is in backlog",
      [TaskStatus.ARCHIVED]: "Task is archived",
    };

    return statusTitles[task.status] ?? "View Task";
  }, [isEditMode, task, escrow.title]);

  const dialogDescription = useMemo(() => {
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
  }, [isEditMode, task, translate, translateCaps]);

  const isLoading = isCreating || isUpdating;

  return (
    <Form {...form}>
      <DialogForm
        openButton={!!id ? "Edit Task" : "Draft a new task"}
        openButtonIntent="default"
        openButtonSize={openButtonSize}
        icon={isEditMode ? "pencil" : "plus"}
        title={dialogTitle}
        description={dialogDescription}
        buttonLabel={isEditMode ? "Save Changes" : "Save Draft"}
        buttonLoading={isLoading}
        buttonDisabled={isLoading}
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        {(!task || task.status === TaskStatus.DRAFT) ? (
          <TaskFormView
            form={form}
            escrow={escrow}
            isLoading={isLoading}
          />
        ) : (
          <TaskDisplayView
            task={task}
            isUpdating={isUpdating}
            onRevertToDraft={handleRevertToDraft}
          />
        )}
      </DialogForm>
    </Form>
  );
}
