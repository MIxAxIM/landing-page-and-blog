import { Task } from "@prisma/client";
import { Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "~/components/common/loading";
import RenderEditor from "~/components/editor/components/render/RenderEditor";
import ContentEditorSm from "~/components/editor/ContentEditor/editor-sm";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import { Button } from "~/components/ui/button";
import { useTask } from "~/hooks/db/contribution/useTask";
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment";
import { useTreasury } from "~/hooks/db/contribution/useTreasury";
import useTaskCommitmentEditor from "~/ui/contribution/useTaskCommitmentEditor";
import MenuBar from "~/ui/landing/MenuBar";
import { blake2b } from "blakejs";
import CommitProjectDialog from "~/components/cardano/tx/contributor/commit-project/CommitProjectDialog";
import useProjectByTreasury from "~/hooks/cardano-indexer-api/project/useProjectByTreasury";

export default function ProjectPage() {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { project, task } = router.query;
  const { taskCommitments } = useTaskCommitment({
    taskId: task as string,
    contributorId: sessionData?.user?.contributorId,
  });

  const { treasury, isLoading } = useTreasury(project as string);
  const { treasuryInfo, isLoadingTreasuryInfo } = useProjectByTreasury({
    treasuryNftPolicyId: treasury?.treasuryNftPolicyId ?? "",
  });
  const { tasks, isLoading: isLoadingTasks } = useTask({
    treasuryNftPolicyId: treasury?.treasuryNftPolicyId ?? "",
  });

  const projectDatum = treasuryInfo?.projects.find(
    (p) => p.project_hash === task,
  );

  const [taskInfo, setTaskInfo] = useState<Task | undefined>(undefined);
  useEffect(() => {
    if (projectDatum && tasks && tasks.length > 0) {
      tasks.find((task) => {
        if (task.hash === projectDatum.project_hash) {
          setTaskInfo(task);
          return true;
        }
      });
    }
  }, [tasks, isLoadingTasks, projectDatum]);

  // 1. Check visible
  // 2. save evidence content

  const [lock, setLock] = useState(false);
  const [evidenceHash, setEvidenceHash] = useState<string | undefined>(
    undefined,
  );

  //useEffect(() => {
  //  if (lock) {
  //    const data = editor?.getJSON();
  //    if (data) {
  //      const hash = blake2b(Buffer.from(JSON.stringify(data)), undefined, 32);
  //      setEvidenceHash(Buffer.from(hash).toString("hex"));
  //    }
  //  }
  //}, [lock]);

  function lockEditor() {
    if (lock) {
      setLock(false);
      return;
    }
    setLock(true);
  }

  //const { editor } = useTaskCommitmentEditor(task as string, !lock);

  return (
    <DesktopOnlyLayout>
      <MenuBar />
      <div className="flex items-center justify-center">
        <div
          key={projectDatum?.project_hash ?? ""}
          className="mt-2 max-w-fit transform rounded-lg bg-white p-4 shadow-md transition-transform"
        >
          <h3 className="font-bold">Task Details</h3>
          <div className="max-w-fit truncate">
            <span className="text-xs text-slate-500">{task}</span>
          </div>
          {isLoadingTasks ? (
            <Loading />
          ) : taskInfo ? (
            <pre>{JSON.stringify(task, null, 2)}</pre>
          ) : (
            <div className="my-4 text-red-500">
              Task data not found in database
            </div>
          )}
          <p className="truncate text-sm text-gray-600">
            Commitments left: <b>{projectDatum?.commitment_allowed}</b>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-1">
        <h3>Enter Submission Details</h3>
      </div>

      {/** !!editor && <ContentEditorSm editor={editor} editable={!lock} /> **/}
      {lock && evidenceHash && (
        <div className="flex items-center justify-center">
          <h5>
            Data Hash: <b>{evidenceHash}</b>
          </h5>
        </div>
      )}
      <div className="flex p-4 items-center justify-center gap-3">
        <div>
          <Button
            className={`rounded-md text-white ${lock ? "bg-slate-500" : "bg-blue-500"}`}
            onClick={lockEditor}
          >
            {lock ? (
              <>
                <Lock />" Unlock"
              </>
            ) : (
              "Lock"
            )}
          </Button>
        </div>

        {/* <Button
          className="rounded-md bg-blue-500 px-5 py-2 text-white"
          disabled={!lock}
        >
          Submit
        </Button> */}
        <div>
          <CommitProjectDialog
            treasuryNftPolicyId={treasury?.treasuryNftPolicyId ?? ""}
            taskId={projectDatum?.project_hash ?? ""}
            info={evidenceHash}
            disabled={!lock}
          />
        </div>
      </div>
    </DesktopOnlyLayout>
  );
}
