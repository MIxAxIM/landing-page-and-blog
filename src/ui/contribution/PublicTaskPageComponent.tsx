import { useEscrowPrerequisites } from "~/hooks/db/contribution/useEscrowPrerequisites";
import { useTreasury } from "~/hooks/db/contribution/useTreasury";
import { type Task } from "~/types/db";
import { formatPosixTime } from "~/utils/time";
import { ChatContainer } from "~/components/chat/chat-container";
import { PrerequisiteItem } from "./lists/PrerequisiteList";
import { useTerminology } from "~/contexts/terminology-context";
import PlaceholderComponent from "~/components/placeholders/PlaceholderComponent";
import { Card } from "~/components/ui/card";
import Link from "next/link";
import { BookIcon, School2Icon } from "lucide-react";
import TaskStatusIndicator from "./status/TaskStatusIndicator";
import CommitProjectDialog from "~/components/cardano/tx/contributor/commit-project/CommitProjectDialog";
import GetRewardsDialog from "~/components/cardano/tx/contributor/get-rewards/GetRewardsDialog";
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";


export default function PublicTaskPageComponent({ task }: { task: Task }) {
  const { data: sessionData } = useSession();
  const { translateCaps, translateCapsPlural } = useTerminology()
  const { taskCommitments } = useTaskCommitment({ taskId: task.id, contributorId: sessionData?.user?.contributorId, status: "COMMITMENT_ACCEPTED" });
  const { treasury } = useTreasury(task.escrow?.treasuryId);
  const { escrowPrerequisites } = useEscrowPrerequisites({
    escrowId: task.escrow?.id,
  });
  return (
    <>
      <Card className="mx-auto my-24 max-w-5xl space-y-10">
        <h1>{task.title}</h1>
        <p className="prose text-2xl">
          This is a task in the <span className="font-bold text-primary">{task.escrow?.title}</span> project at <span className="font-bold text-primary">{treasury?.title}</span>.
        </p>
        <div className="space-y-3">
          <p className="prose">{task.description}</p>
          <h2>{translateCaps('acceptanceCriteria')}</h2>
          <ul className="prose ml-5 list-decimal">
            {task.acceptanceCriteria.map((ac, i) => (
              <li key={i}>{ac}</li>
            ))}
          </ul>

          <TaskStatusIndicator status={task.status} showLabel />
          <p className="prose">Ada Reward: {parseInt(task.lovelace) / 1000000}</p>
          <p className="prose">
            Expiration Time: {formatPosixTime(task.expirationTime)}
          </p>
        </div>

        {!!treasury && !!task.id && (
          <div>
            <h2>Commit to this task</h2>
            <Link href={`/app/testing/${treasury.treasuryNftPolicyId}/${task.hash}`}>
              <Button>Commit to this Task</Button>
            </Link>
          </div>
        )}

        {taskCommitments[0] && (
          <GetRewardsDialog treasuryNftPolicyId={treasury?.treasuryNftPolicyId ?? ""} taskCommitmentId={taskCommitments[0].id} />
        )}

        <div>

          <h3>
            The following {translateCapsPlural('prerequisite')} must be completed:
          </h3>

          {escrowPrerequisites?.map((ep, i) => (
            <Link
              key={i}
              href={`/course/${ep.courseRequirements[0]?.courseCode}`}
            >
              <div
                className="flex min-h-36 flex-row items-center gap-10 px-10"
              >
                <BookIcon size={48} className="text-success" />
                <PrerequisiteItem prerequisite={ep} />
              </div>
            </Link>
          ))}
          <div className="rounded-md text-foreground">
            <h3>
              Discuss this task with the Andamio Community
            </h3>
            <ChatContainer roomId={task.id} />
          </div>
        </div>
        <PlaceholderComponent name="If I am committed to this task, view submission UI. I can see how to submit evidence of work, receive feedback, and check the status of submissions." userStory="CONTRIBUTION-010" />
        <PlaceholderComponent name="Commit to this task" userStory="CONTRIBUTION-011" />
        <PlaceholderComponent name="calls to action: go learn, from courses, get involved, etc" />
        <PlaceholderComponent name="what user stories are picked up here?" />
      </Card>
    </>
  );
}
