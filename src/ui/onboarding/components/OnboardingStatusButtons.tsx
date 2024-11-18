

import { Button } from "~/components/ui/button";
export default function OnboardingStatusButtons({
  roleId,
  onStatusChange
}: {
  roleId: string;
  onStatusChange: (roldId: string, status: "NOT_STARTED" | "SKIPPED" | "PARTIAL" | "COMPLETE", completedAt?: Date) => void;
}) {
  return (
    <div className="flex flex-col gap-y-4">
      <Button
        intent="ghost"
        size="sm"
        onClick={() => onStatusChange(roleId, "NOT_STARTED")}
      >
        Not Started
      </Button>

      <Button
        intent="outline"
        size="sm"
        onClick={() => onStatusChange(roleId, "SKIPPED")}
      >
        Skip
      </Button>

      <Button
        intent="secondary"
        size="sm"
        onClick={() => onStatusChange(roleId, "PARTIAL")}
      >
        Partial
      </Button>

      <Button
        intent="default"
        size="sm"
        onClick={() => onStatusChange(roleId, "COMPLETE", new Date())}
        className="bg-green-600 hover:bg-green-700"
      >
        Complete
      </Button>
    </div>
  );
}
