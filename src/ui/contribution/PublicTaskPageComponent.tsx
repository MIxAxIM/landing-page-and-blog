import { useEscrowPrerequisites } from "~/hooks/db/contribution/useEscrowPrerequisites";
import { useTreasury } from "~/hooks/db/contribution/useTreasury";
import { type Task } from "~/types/db";
import { formatPosixTime } from "~/utils/time";
import PlaceholderComponent from "../prototype/PlaceholderComponent";
import { ChatContainer } from "~/components/chat/chat-container";
import { PrerequisiteItem } from "./lists/PrerequisiteList";
import { useTerminology } from "~/contexts/terminology-context";

export default function PublicTaskPageComponent({ task }: { task: Task }) {
  const { translateCaps, translateCapsPlural } = useTerminology()
  const { treasury } = useTreasury(task.escrow?.treasuryId);
  const { escrowPrerequisites } = useEscrowPrerequisites({
    escrowId: task.escrow?.id,
  });
  return (
    <>
      <div className="mx-auto my-24 max-w-7xl space-y-10">
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

          <p className="prose">Current Status: {task.status}</p>
          <p className="prose">Ada Reward: {parseInt(task.lovelace) / 1000000}</p>
          <p className="prose">
            Expiration Time: {formatPosixTime(task.expirationTime)}
          </p>
        </div>

        <p className="prose my-10 text-2xl">
          The following {translateCapsPlural('prerequisite')} must be completed:
        </p>

        {escrowPrerequisites?.map((ep, i) => (
          <div
            key={i}
            className="flex min-h-36 flex-row items-center gap-10 px-10"
          >
            <div className="h-12 w-12 rounded-full bg-green-400" />
            <PrerequisiteItem prerequisite={ep} />
          </div>
        ))}
        <p className="prose my-10 text-2xl">
          Discuss this task with the Andamio Community
        </p>
        <div className="rounded-md bg-background text-foreground">
          <ChatContainer roomId={task.id} />
        </div>
        <PlaceholderComponent name="If I am committed to this task, view submission UI. I can see how to submit evidence of work, receive feedback, and check the status of submissions." userStory="CONTRIBUTION-010" />
        <PlaceholderComponent name="Commit to this task" userStory="CONTRIBUTION-011" />
        <PlaceholderComponent name="calls to action: go learn, from courses, get involved, etc" />
        <PlaceholderComponent name="what user stories are picked up here?" />
      </div>
    </>
  );
}
