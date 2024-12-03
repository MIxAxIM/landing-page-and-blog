

import { Button } from "~/components/ui/button";
export default function OnboardingStatusButtons({
  roleId,
  onStatusChange
}: {
  roleId: string;
  onStatusChange: (roldId: string, status: "NOT_STARTED" | "SKIPPED" | "PARTIAL" | "COMPLETE", completedAt?: Date) => void;
}) {
  return (
    <div className="flex flex-row gap-x-4 p-2 items-center">

      <p>Set onboarding status:</p>
      <Button
        intent="outline"
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
