import { useState } from "react";
import { useTask } from "~/hooks/db/contribution/useTask";
import { useEscrow } from "~/hooks/db/contribution/useEscrow";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import DialogForm from "~/components/form/dialog-form";
import { TaskStatus } from "@prisma/client";
import { toast } from "react-hot-toast";
import { type Task } from "~/types/db";

type TasksByEscrow = Record<string, Task[]>;

export default function DialogPublishTreasuryTx({
  treasuryId,
}: {
  treasuryId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Get all escrows for this treasury
  const { treasuryEscrows } = useEscrow({ treasuryId: treasuryId });

  // Get all approved tasks for this treasury
  const { filteredTasks, updateTaskStatus, isUpdating } = useTask({
    treasuryNftPolicyId: treasuryId,
    selectedStatuses: [TaskStatus.APPROVED],
  });

  // Group tasks by escrow for better organization
  const tasksByEscrow = filteredTasks.reduce<TasksByEscrow>((acc, task) => {
    const escrowTitle =
      treasuryEscrows.find((e) => e?.id === task.escrowId)?.title ??
      "Unknown Escrow";
    if (!acc[escrowTitle]) {
      acc[escrowTitle] = [];
    }
    acc[escrowTitle] = [...(acc[escrowTitle] ?? []), task];
    return acc;
  }, {});

  // State for checked items
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());

  // Reset state when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setCheckedTasks(new Set(filteredTasks.map((task) => task.id)));
    }
    setIsOpen(open);
  };

  // Handle checkbox changes
  const toggleTask = (taskId: string) => {
    const newCheckedTasks = new Set(checkedTasks);
    if (newCheckedTasks.has(taskId)) {
      newCheckedTasks.delete(taskId);
    } else {
      newCheckedTasks.add(taskId);
    }
    setCheckedTasks(newCheckedTasks);
  };

  // Toggle all tasks in an escrow
  const toggleEscrowTasks = (tasks: Task[]) => {
    const taskIds = tasks.map((t) => t?.id);
    const allChecked = taskIds.every((id) => checkedTasks.has(id ?? ""));

    const newCheckedTasks = new Set(checkedTasks);
    taskIds.forEach((id) => {
      if (allChecked) {
        newCheckedTasks.delete(id ?? "");
      } else {
        newCheckedTasks.add(id ?? "");
      }
    });

    setCheckedTasks(newCheckedTasks);
  };

  // Handle publish submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Update all checked tasks to PENDING_TX status
      const updatePromises = Array.from(checkedTasks).map((taskId) =>
        updateTaskStatus({ id: taskId, status: TaskStatus.PENDING_TX }),
      );

      await Promise.all(updatePromises);

      toast.success(
        `Successfully published ${checkedTasks.size} task${checkedTasks.size === 1 ? "" : "s"
        } to the network`,
      );
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to publish tasks to the network");
      console.error("Publish error:", error);
    }
  };

  const isButtonDisabled = checkedTasks.size === 0;
  const totalValue = filteredTasks
    .filter((task) => checkedTasks.has(task.id))
    .reduce((sum, task) => sum + parseInt(task.lovelace) / 1_000_000, 0);

  return (
    <DialogForm
      openButton="Sync"
      openButtonIntent="dialog"
      icon="plus"
      title="Publish Approved Tasks to Network"
      description={`Select tasks to be published. Total value: ${totalValue.toLocaleString()} ADA`}
      buttonLabel={`Publish ${checkedTasks.size} Tasks to Network`}
      buttonLoading={isUpdating}
      buttonDisabled={isButtonDisabled}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={handleOpenChange}
    >
      <div className="max-h-[60vh] max-w-[1200px] space-y-6 overflow-y-auto py-4">
        {Object.entries(tasksByEscrow).map(([escrowTitle, tasks]) => (
          <div key={escrowTitle} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3>{escrowTitle}</h3>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`escrow-${escrowTitle}`}
                  checked={tasks.every((task) =>
                    checkedTasks.has(task?.id ?? ""),
                  )}
                  onCheckedChange={() => toggleEscrowTasks(tasks)}
                />
                <label
                  htmlFor={`escrow-${escrowTitle}`}
                  className="text-sm text-muted-foreground"
                >
                  Select All
                </label>
              </div>
            </div>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task?.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={task?.id}
                    checked={checkedTasks.has(task?.id ?? "")}
                    onCheckedChange={() => toggleTask(task?.id ?? "")}
                  />
                  <label htmlFor={task?.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="line-clamp-1">{task?.title}</span>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant="outline">Task #{task?.index}</Badge>
                        <Badge variant="secondary">
                          {parseInt(task?.lovelace ?? "0") / 1_000_000} ADA
                        </Badge>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No approved tasks available to publish
          </p>
        )}
      </div>
    </DialogForm>
  );
}
