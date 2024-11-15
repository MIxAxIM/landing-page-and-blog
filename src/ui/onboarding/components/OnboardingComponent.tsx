import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import OnboardingStatusButtons from "./OnboardingStatusButtons";
import { OnboardingStatus } from "@prisma/client";

type RoleStatus = {
  id: string;
  userId: string;
  isActive: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  onboardingStatus: OnboardingStatus | null;
  onboardingCompletedAt: Date | null;
} | null | undefined

interface OnboardRoleProps {
  title: string;
  roleStatus: RoleStatus
  enableRole: () => void;
  updateRoleStatus: (id: string, status: OnboardingStatus) => void;
  FirstStepContent?: React.ComponentType;
  NextStepContent?: React.ComponentType;
}

export default function OnboardRole({
  title,
  roleStatus,
  enableRole,
  updateRoleStatus,
  FirstStepContent,
  NextStepContent,
}: OnboardRoleProps) {
  return (
    <div className="flex flex-row justify-between item-center w-full h-full bg-background border border-primary p-5 rounded-sm gap-x-10">
      <div className="flex flex-col w-full space-y-4">
        <h1 className="prose-h1 text-2xl">{title}</h1>
        <Badge className="w-48 py-1">{roleStatus?.onboardingStatus}</Badge>

        {roleStatus?.onboardingStatus === "NOT_STARTED" && (
          <Card>
            <h2>Onboarding not started</h2>
            <Button onClick={() => updateRoleStatus(roleStatus.id, "PARTIAL")}>
              Start now!
            </Button>
          </Card>
        )}

        {roleStatus?.onboardingStatus === "PARTIAL" && (
          <div className="space-y-2">
            <h2 className="prose-h2 text-lg">How to start:</h2>
            {FirstStepContent && <FirstStepContent />}
          </div>
        )}

        {(roleStatus?.onboardingStatus === "SKIPPED" ||
          roleStatus?.onboardingStatus === "COMPLETE") && (
            <div className="space-y-2">
              <h2 className="prose-h2 text-lg">
                Keep going - here is your next step
              </h2>
              {NextStepContent && <NextStepContent />}
            </div>
          )}

        {!roleStatus && (
          <Button onClick={enableRole}>Get Started</Button>
        )}
      </div>

      <div>
        {!!roleStatus?.id && (
          <OnboardingStatusButtons
            roleId={roleStatus.id}
            onStatusChange={updateRoleStatus}
          />
        )}
      </div>
    </div>
  );
}
