import { useEscrowPrerequisites } from "~/hooks/db/contribution/useEscrowPrerequisites";
import { useTreasury } from "~/hooks/db/contribution/useTreasury";
import { formatPosixTime } from "~/utils/time";
import { ChatContainer } from "~/components/chat/chat-container";
import { PrerequisiteItem } from "./lists/PrerequisiteList";
import { useTerminology } from "~/contexts/terminology-context";
import { Card } from "~/components/ui/card";
import Link from "next/link";
import { BookIcon } from "lucide-react";
import TaskStatusIndicator from "./status/TaskStatusIndicator";
import GetRewardsDialog from "~/components/cardano/tx/contributor/get-rewards/GetRewardsDialog";
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment";
import { useSession } from "next-auth/react";
import { useTask } from "~/hooks/db/contribution/useTask";
import { usePendingGetRewards } from "~/hooks/cardano-indexer-api/polling/usePendingGetRewards";
import { usePendingCommitProjectCheck } from "~/hooks/cardano-indexer-api/polling/usePendingCommitProjectCheck";


export default function PublicTaskPageComponent({ projectHash }: { projectHash: string }) {
  const { data: sessionData } = useSession();
  // TODO: Add the new task query here
  const { task } = useTask({ projectHash: projectHash })
  const { translateCaps, translateCapsPlural } = useTerminology()
  const { taskCommitments } = useTaskCommitment({ taskId: task?.id, contributorId: sessionData?.user?.contributorId, status: "COMMITMENT_ACCEPTED" });
  const { treasury } = useTreasury(task?.escrow?.treasuryId);
  const { escrowPrerequisites } = useEscrowPrerequisites({
    escrowId: task?.escrow?.id,
  });
  usePendingGetRewards(treasury?.treasuryNftPolicyId ?? "");
  usePendingCommitProjectCheck(treasury?.treasuryNftPolicyId ?? "");

  if (!task) return "Cannot find task"

  return (
    <div className="flex flex-col mx-auto my-24 w-full space-y-10">
      <div className="flex flex-row items-center justify-between">
        <h1>{task.title}</h1>
      </div>
      <TaskStatusIndicator
        status={task?.status}
        numAllowedCommitments={task.numAllowedCommitments}
        taskCommitments={task.taskCommitments}
        showLabel
      />
      <p className="prose text-lg">
        This is a task in the <span className="font-bold text-primary">{task.escrow?.title}</span> project at <span className="font-bold text-primary">{treasury?.title}</span>.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-2 flex flex-row justify-between items-center">
          <div>
            <p className="prose">Ada Reward: {parseInt(task.lovelace) / 1000000}</p>
          </div>
          <div>
            <p className="prose">
              Available Until: {formatPosixTime(task.expirationTime)}
            </p>
          </div>
          <div>
            {
              taskCommitments[0] && (
                <GetRewardsDialog treasuryNftPolicyId={treasury?.treasuryNftPolicyId ?? ""} taskCommitmentId={taskCommitments[0].id} />
              )
            }
          </div>
          <div>
            Number of Commitments Allowed: {task.numAllowedCommitments}
          </div>
        </Card>
        <Card>
          <p className="mb-3 font-bold">Description</p>
          <p className="prose">{task.description}</p>
          <p className="my-3 font-bold">{translateCaps('acceptanceCriteria')}</p>
          <ul className="prose ml-5 list-decimal">
            {task.acceptanceCriteria.map((ac, i) => (
              <li key={i}>{ac}</li>
            ))}
          </ul>
        </Card>
        <Card>
          {escrowPrerequisites?.map((ep, i) => (
            <Link
              key={i}
              href={`/course/${ep.courseRequirements[0]?.courseCode}`}
            >
              <div
                className="flex flex-row items-center gap-10"
              >
                <BookIcon size={48} className="text-success" />
                <PrerequisiteItem prerequisite={ep} />
              </div>
            </Link>
          ))}
          <p className="prose text-sm">
            To be eligble to contribute to this task, you must complete this prerequisite.
          </p>
        </Card>
        <Card className="col-span-2">
          <div className="rounded-md text-foreground">
            <h3>
              Discuss this task with the Andamio Community
            </h3>
            <ChatContainer roomId={task.id} />
          </div>
        </Card>
      </div >




    </div >
  );
}

// TODO: User Stories
//
//<PlaceholderComponent name="If I am committed to this task, view submission UI. I can see how to submit evidence of work, receive feedback, and check the status of submissions." userStory="CONTRIBUTION-010" />
//<PlaceholderComponent name="Commit to this task" userStory="CONTRIBUTION-011" />
//<PlaceholderComponent name="calls to action: go learn, from courses, get involved, etc" />
//<PlaceholderComponent name="what user stories are picked up here?" />
