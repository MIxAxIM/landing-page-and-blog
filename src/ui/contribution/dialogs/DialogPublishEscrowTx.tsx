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
  const [checkedPrerequisites, setCheckedPrerequisites] = useState<Set<string>>(
    new Set(),
  );

  // Reset state when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setCheckedTasks(new Set(filteredTasks.map((task) => task.id)));
      setCheckedPrerequisites(
        new Set(
          escrow?.contributorPrerequisites?.map(
            (prereq) => prereq.contributorPolicyId,
          ) ?? [],
        ),
      );
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

  const togglePrerequisite = (prerequisiteId: string) => {
    const newCheckedPrerequisites = new Set(checkedPrerequisites);
    if (newCheckedPrerequisites.has(prerequisiteId)) {
      newCheckedPrerequisites.delete(prerequisiteId);
    } else {
      newCheckedPrerequisites.add(prerequisiteId);
    }
    setCheckedPrerequisites(newCheckedPrerequisites);
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
    checkedTasks.size === 0 && checkedPrerequisites.size === 0;

  return (
    <DialogForm
      openButton="Sync"
      openButtonIntent="default"
      title="Publish Escrow to Network"
      description="Confirm the tasks and prerequisites to be published to the network."
      buttonLabel="Publish to Network"
      buttonLoading={isUpdating}
      buttonDisabled={isButtonDisabled}
      handleSubmit={handleSubmit}
      isOpen={isOpen}
      setIsOpen={handleOpenChange}
    >
      <div className="max-h-[60vh] space-y-6 overflow-y-auto py-4">
        {/* Tasks Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tasks to Publish</h3>
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={checkedTasks.has(task.id)}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className="flex-1 cursor-pointer"
                >
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

        {/* Prerequisites Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Prerequisites to Publish</h3>
          <div className="space-y-2">
            {escrow?.contributorPrerequisites?.map((prereq) => (
              <div
                key={prereq.contributorPolicyId}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={`prereq-${prereq.contributorPolicyId}`}
                  checked={checkedPrerequisites.has(prereq.contributorPolicyId)}
                  onCheckedChange={() =>
                    togglePrerequisite(prereq.contributorPolicyId)
                  }
                />
                <label
                  htmlFor={`prereq-${prereq.contributorPolicyId}`}
                  className="cursor-pointer"
                >
                  <div>
                    <p className="font-medium">
                      {prereq.title ?? "Untitled Prerequisite"}
                    </p>
                    <p className="break-all text-xs text-muted-foreground">
                      {prereq.contributorPolicyId}
                    </p>
                  </div>
                </label>
              </div>
            ))}
            {!escrow?.contributorPrerequisites?.length && (
              <p className="text-sm text-muted-foreground">
                No prerequisites available to publish
              </p>
            )}
          </div>
        </div>
      </div>
    </DialogForm>
  );
}
