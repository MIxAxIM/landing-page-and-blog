import { AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
import Loading from "~/components/common/loading";
import VideoPlayer from "~/components/media/VideoPlayer";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import useValidateCreator from "~/hooks/db/course/useValidateCreator";
import {
  type AssignmentCommitment,
  type CourseModuleOverview,
} from "~/types/db";
import CourseLayout from "~/components/layout/CourseLayout";
import ModuleLayout from "~/components/layout/ModuleLayout";
import SltList from "~/ui/studio/components/assignment-dashboard/slt-list";
import { useEffect, useState } from "react";

import RenderEditor from "~/components/editor/components/render/RenderEditor";
import CourseNavigation from "~/ui/course/components/ui/CourseNavigation";
import Metatags from "~/components/common/metatags";

import "highlight.js/styles/atom-one-dark.css";
import PersonalNotesCard from "~/ui/course/components/assignments/cards/PersonalNotesCard";
import { useWallet } from "@meshsdk/react";
import useAssignmentNetworkStatus from "~/hooks/cardano-indexer-api/course/useAssignmentNetworkStatus";
import ConnectWalletCard from "~/components/cardano/common/ConnectWalletCard";
import AssignmentCommitmentPageComponent from "~/ui/app/AssignmentCommitmentPageComponent";

export default function PageCourseAssignmentContent({
  courseCode,
  courseModule,
  courseNftPolicyId,
}: {
  courseCode: string;
  courseModule: CourseModuleOverview;
  courseNftPolicyId: string
}) {
  const { data: sessionData } = useSession();

  const { assignment, isLoadingAssignment } = useAssignmentNetworkStatus({
    courseCode: courseCode,
    moduleCode: courseModule.moduleCode,
  });

  const { isCreator } = useValidateCreator(sessionData, courseCode);

  return (
    <CourseLayout>
      <ModuleLayout courseCode={courseCode} courseModule={courseModule}>
        <Metatags title={assignment?.title ?? undefined} />
        {assignment && assignment.live ? (
          <div className="mx-auto flex min-h-[85vh] w-11/12 max-w-5xl flex-col gap-4 text-base leading-7 text-foreground">
            <Page courseModule={courseModule} courseCode={courseCode} courseNftPolicyId={courseNftPolicyId} />
            <CourseNavigation
              courseCode={courseCode}
              courseModule={courseModule}
              moduleIndex={"assignment"}
            />
          </div>
        ) : assignment && !assignment.live ? (
          <div className="mx-auto flex w-11/12 max-w-5xl flex-col gap-4 text-base leading-7 text-foreground">
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Assignment is not Live!</AlertTitle>
              <AlertDescription>
                Learners will not be able to see this assignment.
              </AlertDescription>
            </Alert>
            {isCreator && (
              <Page courseModule={courseModule} courseCode={courseCode} courseNftPolicyId={courseNftPolicyId} />
            )}
          </div>
        ) : isLoadingAssignment ? (
          <Loading />
        ) : null}
      </ModuleLayout>
    </CourseLayout>
  );
}

function Page({
  courseModule,
  courseCode,
  courseNftPolicyId,
}: {
  courseModule: CourseModuleOverview;
  courseCode: string;
  courseNftPolicyId: string;
}) {
  const { data: sessionData } = useSession();
  const { connected } = useWallet();
  const [currentCommitment, setCurrentCommitment] = useState<
    AssignmentCommitment | undefined
  >(undefined);

  const { assignment, isAssignmentOnchain } = useAssignmentNetworkStatus({
    courseCode: courseCode,
    moduleCode: courseModule.moduleCode,
  });

  useEffect(() => {
    if (sessionData && assignment) {
      const currentCommitment = sessionData?.user.assignmentCommitments.find(
        (a) => a.assignmentId === assignment.id,
      );
      setCurrentCommitment(currentCommitment);
    }
  }, [sessionData, assignment]);

  if (
    assignment &&
    assignment.contentJson &&
    typeof assignment.contentJson === "object"
  ) {
    const editor = RenderEditor({
      editable: false,
      initialContent: assignment?.contentJson,
    });

    return (
      <>
        <div>
          <h1>
            {assignment.title}
          </h1>
          {/* <p className="py-5 text-xl leading-8">{assignment.description}</p> */}
          {assignment.videoUrl && <VideoPlayer videoId={assignment.videoUrl} />}
          <div className="my-10">
            <SltList courseModule={courseModule} assignment={assignment} />
          </div>
        </div>
        {editor}

        <div className="mt-10 grid grid-cols-1 gap-5">
          <PersonalNotesCard
            currentCommitment={currentCommitment}
            assignment={assignment}
          />

          {isAssignmentOnchain && (
            <>
              {connected ? (
                <AssignmentCommitmentPageComponent
                  courseCode={courseCode}
                  moduleCode={courseModule.moduleCode}
                  courseNftPolicyId={courseNftPolicyId}
                />
              ) : (
                <ConnectWalletCard message="Connect a wallet to commit to this assignment" />
              )}
            </>
          )}
        </div>
      </>
    );
  }
}
