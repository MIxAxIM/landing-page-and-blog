import { type ContributorPrerequisite } from "~/types/db";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";

interface PrerequisiteListProps {
  prerequisites: ContributorPrerequisite[];
  onRemove?: (prerequisiteId: string) => void;
  isRemoving?: boolean;
  emptyMessage: string;
  title?: string;
}

export function PrerequisiteList({
  prerequisites,
  onRemove,
  isRemoving,
  emptyMessage,
  title
}: PrerequisiteListProps) {
  if (!prerequisites || prerequisites.length === 0) {
    return (
      <Alert>
        <AlertDescription>{emptyMessage}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      {title && (
        <div className="font-medium text-muted-foreground">{title}</div>
      )}
      <div className="space-y-2">
        {prerequisites.map((prerequisite) => (
          <div
            key={prerequisite.contributorPolicyId}
            className="flex items-center justify-between gap-2 border-t border-primary py-2"
          >
            <PrerequisiteItem prerequisite={prerequisite} />
            {onRemove && (
              <Button
                type="button"
                intent="destructive"
                size="sm"
                onClick={() => onRemove(prerequisite.contributorPolicyId)}
                disabled={isRemoving}
              >
                X
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// PrerequisiteItem component remains the same

export function PrerequisiteItem({
  prerequisite,
}: {
  prerequisite: ContributorPrerequisite;
}) {
  return (
    <div className="my-2 w-[1000px]">
      <p className="mb-1 text-lg font-bold">
        {prerequisite.title ?? "Untitled Prerequisite"}
      </p>
      {!!prerequisite.courseRequirements &&
        prerequisite.courseRequirements.map((req) => (
          <div key={req.id} className="mb-2">
            <p className="font-medium">{req.course?.title}</p>
            <p className="text-sm text-muted-foreground">
              Required Modules: {req.requiredModules.join(", ")}
            </p>
          </div>
        ))}
      <p className="break-all text-xs text-muted-foreground">
        {prerequisite.contributorPolicyId}
      </p>
    </div>
  );
}
