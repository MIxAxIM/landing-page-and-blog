import { useState } from "react";
import { useTask } from "~/hooks/db/contribution/useTask";
import { Button } from "~/components/ui/button";
import { Task } from "~/types/db";
import { useTerminology } from "~/contexts/terminology-context";
import { Dialog, DialogTrigger, DialogContent } from "~/components/ui/dialog";
import { format } from "date-fns";
import { TaskStatus } from "@prisma/client";
import { TrashIcon } from "lucide-react";

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
      {task.hash && (
        <div>
          <h3>Content Hash</h3>
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
  openButtonSize?: "sm" | "lg";
}

export default function DialogDeleteTask({
  id,
}: TaskDialogProps) {
  // State management
  const [isOpen, setIsOpen] = useState(false);

  const isEditMode = !!id;

  // Custom hooks
  const {
    task,
    deleteTask,
    isDeleting
  } = useTask({ id: id });

  const { translate, translateCaps } = useTerminology()

  const getDialogDescription = () => {
    if (!isEditMode) {
      return `Create a new task by selecting the ${translateCaps('treasury')} and a ${translateCaps('escrow')}. Then, provide ${translateCaps('task')} details. This is a draft, and you will be able to change these details later.`;
    }
    if (!task) return "";

    if (task.status === TaskStatus.DRAFT) {
      return `Delete this ${translateCaps('task')}:`;
    }

    if (task.status === TaskStatus.APPROVED) {
      return `This ${translate('task')} is already approved. If you delete it, approval will be lost.`;
    }

    return `This ${translate('task')} cannot be deleted because it is on-chain.`;
  };

  // Form submission handler
  const handleSubmit = async () => {
    try {
      if (!!id) {
        deleteTask(id);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const isLoading = isDeleting
  return (
    <Dialog>
      <DialogTrigger className="p-3">
        <TrashIcon size={24} />
      </DialogTrigger>
      <DialogContent>
        {!!task && (
          <TaskDisplay task={task} />
        )}
        <p>{getDialogDescription()}</p>
        {(task?.status === TaskStatus.APPROVED || task?.status === TaskStatus.DRAFT) && (
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full">Confirm Delete Task</Button>
        )}
      </DialogContent>
    </Dialog>

  )
}
