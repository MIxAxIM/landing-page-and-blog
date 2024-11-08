import { Button } from "~/components/ui/button";
import { useContributorPrerequisite } from "~/hooks/contribution/useContributorPrerequisite";
import { useEscrowPrerequisites } from "~/hooks/contribution/useEscrowPrerequisites";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useMemo } from "react";
import { type ContributorPrerequisite } from "~/types/db";

interface PrerequisiteManagerProps {
  escrowId: string;
  className?: string;
}

export default function PrerequisiteManager({
  escrowId,
  className = "",
}: PrerequisiteManagerProps) {
  // Fetch prerequisites data
  const { prerequisites, isLoading: isLoadingPrerequisites } =
    useContributorPrerequisite();
  const {
    escrowPrerequisites,
    addPrerequisiteToEscrow,
    removePrerequisiteFromEscrow,
    isAdding,
    isRemoving,
  } = useEscrowPrerequisites({ escrowId });

  // Get unassigned prerequisites
  const unassignedPrerequisites = useMemo(() => {
    if (!prerequisites || !escrowPrerequisites) return [];
    return prerequisites.filter(
      (prereq) =>
        !escrowPrerequisites.some(
          (ep) => ep.contributorPolicyId === prereq.contributorPolicyId,
        ),
    );
  }, [prerequisites, escrowPrerequisites]);

  const handleAddPrerequisite = (prerequisiteId: string) => {
    addPrerequisiteToEscrow({
      escrowId,
      prerequisiteId,
    });
  };

  // If there are no prerequisites at all, show a message
  if (!prerequisites || prerequisites.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No prerequisites available. Create prerequisites first to add them to
          this escrow.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`my-5 space-y-4 ${className}`}>
      {/* Current Prerequisites */}
      {escrowPrerequisites.length > 0 ? (
        <div className="space-y-2">
          <div className="font-medium text-muted-foreground">
            Current Prerequisites
          </div>
          <div className="space-y-2">
            {escrowPrerequisites.map((prerequisite) => (
              <div
                key={prerequisite.contributorPolicyId}
                className="flex items-center justify-between gap-2 border-t border-primary py-2"
              >
                <PrerequisiteItem prerequisite={prerequisite} />
                <Button
                  type="button"
                  intent="destructive"
                  size="sm"
                  onClick={() => {
                    removePrerequisiteFromEscrow({
                      escrowId,
                      prerequisiteId: prerequisite.contributorPolicyId,
                    });
                  }}
                  disabled={isRemoving}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Alert>
          <AlertDescription>
            No prerequisites are currently assigned to this escrow.
          </AlertDescription>
        </Alert>
      )}

      {/* Add Prerequisite Select */}
      {unassignedPrerequisites.length > 0 && (
        <div className="space-y-2">
          <div className=" font-medium text-muted-foreground">
            Add Prerequisite
          </div>
          <Select
            onValueChange={handleAddPrerequisite}
            disabled={isLoadingPrerequisites || isAdding}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a prerequisite to add..." />
            </SelectTrigger>
            <SelectContent>
              {unassignedPrerequisites.map(
                (prerequisite: ContributorPrerequisite) => (
                  <SelectItem
                    key={prerequisite.contributorPolicyId}
                    value={prerequisite.contributorPolicyId}
                    className="mb-1 pb-1"
                  >
                    <PrerequisiteItem prerequisite={prerequisite} />
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

function PrerequisiteItem({
  prerequisite,
}: {
  prerequisite: ContributorPrerequisite;
}) {
  return (
    <div className="w-full">
      <p className="mb-1 text-lg font-bold">{prerequisite.title}</p>
      {prerequisite.course.title ?? "Untitled Prerequisite"}
      <p>Modules: {prerequisite.requiredCourseModules.join(", ")}</p>
      <p className="break-all text-xs text-muted-foreground">
        {prerequisite.contributorPolicyId}
      </p>
    </div>
  );
}
