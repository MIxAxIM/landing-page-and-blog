import { useState } from "react";
import { useTask } from "~/hooks/contribution/useTask";
import { useEscrow } from "~/hooks/contribution/useEscrow";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import DialogForm from "~/components/form/dialog-form";
import { TaskStatus } from "@prisma/client";
import { toast } from "react-hot-toast";

export default function DialogPublishEscrow({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { updateEscrowSyncStatus } = useEscrow({ id });
  const { escrow } = useEscrow({ id });

  // Get all tasks for this escrow that are in APPROVED status
  const { filteredTasks, updateTaskStatus, isUpdating } = useTask({
    treasuryNftPolicyId: escrow?.treasuryId,
    selectedEscrows: [id],
    selectedStatuses: [TaskStatus.APPROVED], // Only show APPROVED tasks
  });

  // State for checked items
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
  const [checkedContributors, setCheckedContributors] = useState<Set<string>>(
    new Set(),
  );

  // Reset state when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setCheckedTasks(new Set(filteredTasks.map((task) => task.id)));
      setCheckedContributors(new Set(escrow?.contributorPolicyIds ?? []));
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

  const toggleContributor = (contributorId: string) => {
    const newCheckedContributors = new Set(checkedContributors);
    if (newCheckedContributors.has(contributorId)) {
      newCheckedContributors.delete(contributorId);
    } else {
      newCheckedContributors.add(contributorId);
    }
    setCheckedContributors(newCheckedContributors);
  };

  // Handle sync submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Update all checked tasks to ON_CHAIN status
      const updatePromises = Array.from(checkedTasks).map((taskId) =>
        updateTaskStatus({ id: taskId, status: TaskStatus.ON_CHAIN }),
      );

      // Wait for all task updates to complete
      await Promise.all(updatePromises);

      // Update escrow sync status
      updateEscrowSyncStatus({
        id,
        isSyncedWithNetwork: true,
      });

      toast.success("Successfully published tasks to the network");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to publish tasks to the network");
      console.error("Publish error:", error);
    }
  };

  const isButtonDisabled =
    checkedTasks.size === 0 && checkedContributors.size === 0;

  return (
    <DialogForm
      openButton="Publish Escrow"
      openButtonIntent="default"
      openButtonSize="sm"
      icon="plus"
      title="Publish Escrow to Network"
      description="Confirm the tasks and contributors to be published to the network."
      buttonLabel="Publish to Network"
      buttonLoading={isUpdating}
      buttonDisabled={isButtonDisabled}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={handleOpenChange}
    >
      <div className="max-h-[60vh] max-w-5xl space-y-6 overflow-y-auto py-4">
        {/* Tasks Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tasks to Publish</h3>
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-2">
                <Checkbox
                  id={task.id}
                  checked={checkedTasks.has(task.id)}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <label htmlFor={task.id} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span>{task.title}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{task.status}</Badge>
                      <Badge variant="secondary">
                        {parseInt(task.lovelace) / 1_000_000} ADA
                      </Badge>
                    </div>
                  </div>
                </label>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No approved tasks available to publish
              </p>
            )}
          </div>
        </div>

        {/* Contributors Section */}
        <div className="space-y-4 text-xs">
          <h3 className="text-lg font-medium">Contributors to Publish</h3>
          <div className="space-y-2">
            {escrow?.contributorPolicyIds.map((contributorId) => (
              <div key={contributorId} className="flex items-center space-x-2">
                <Checkbox
                  id={contributorId}
                  checked={checkedContributors.has(contributorId)}
                  onCheckedChange={() => toggleContributor(contributorId)}
                />
                <label
                  htmlFor={contributorId}
                  className="cursor-pointer break-all"
                >
                  {contributorId}
                </label>
              </div>
            ))}
            {(!escrow?.contributorPolicyIds ||
              escrow.contributorPolicyIds.length === 0) && (
              <p className="text-sm text-muted-foreground">
                No contributors available to publish
              </p>
            )}
          </div>
        </div>
      </div>
    </DialogForm>
  );
}
