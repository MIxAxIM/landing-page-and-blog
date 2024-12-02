import { AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import RenderEditor from "~/components/editor/components/render/RenderEditor";
import Loading from "~/components/common/loading";
import VideoPlayer from "~/components/media/VideoPlayer";
import Metatags from "~/components/common/metatags";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Card } from "~/components/ui/card";
import useIntroduction from "~/hooks/db/course/useIntroduction";
import useValidateCreator from "~/hooks/db/course/useValidateCreator";
import {
  type Introduction,
  type CourseModuleOverview,
  type ModuleSLT,
} from "~/types/db";
import CourseLayout from "~/ui/course/components/layout/CourseLayout";
import ModuleLayout from "~/ui/course/components/layout/ModuleLayout";
import CourseNavigation from "~/ui/course/components/ui/CourseNavigation";
import LoadingCircle from "~/ui/studio/components/ContentEditor/ui/icons/loading-circle";

import "highlight.js/styles/atom-one-dark.css";

export default function PageCourseIntroductionContent({
  courseCode,
  courseModule,
}: {
  courseCode: string;
  courseModule: CourseModuleOverview;
}) {
  const { data: sessionData } = useSession();

  const { introduction, isLoadingIntro } = useIntroduction(courseModule.id);

  const { isCreator } = useValidateCreator(sessionData, courseCode);

  if (isLoadingIntro) {
    return <LoadingCircle />;
  }

  return (
    <CourseLayout>
      <ModuleLayout courseCode={courseCode} courseModule={courseModule}>
        <Metatags title={introduction?.title ?? undefined} />
        {introduction && introduction.live ? (
          <div className="mx-auto flex min-h-[85vh] w-11/12 max-w-5xl flex-col gap-4 text-base leading-7 text-foreground">
            <Page
              slts={courseModule.slts}
              introduction={introduction}
              moduleCode={courseModule.moduleCode}
              courseCode={courseCode}
            />
            <CourseNavigation
              courseCode={courseCode}
              courseModule={courseModule}
              moduleIndex={"intro"}
            />
          </div>
        ) : introduction && !introduction.live ? (
          <div className="mx-auto flex w-11/12 max-w-5xl flex-col gap-4 text-base leading-7 text-foreground">
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>introduction is not Live!</AlertTitle>
              <AlertDescription>
                Learners will not be able to see this introduction.
              </AlertDescription>
            </Alert>
            {isCreator && (
              <Page
                slts={courseModule.slts}
                introduction={introduction}
                moduleCode={courseModule.moduleCode}
                courseCode={courseCode}
              />
            )}
          </div>
        ) : isLoadingIntro ? (
          <Loading />
        ) : null}
      </ModuleLayout>
    </CourseLayout>
  );
}

function Page({
  introduction,
  slts,
  moduleCode,
  courseCode,
}: {
  introduction: Introduction;
  slts: ModuleSLT[];
  moduleCode: string;
  courseCode: string;
}) {
  if (
    introduction &&
    introduction.contentJson &&
    typeof introduction.contentJson === "object"
  ) {
    const editor = RenderEditor({
      editable: false,
      initialContent: introduction?.contentJson,
    });

    if (!!introduction) {
      return (
        <>
          <div>
            <h1>
              {introduction.title}
            </h1>
            {/* <p className="pb-10 text-xl leading-8">
              {introduction.description}
            </p> */}
            {introduction.videoUrl && (
              <VideoPlayer videoId={introduction.videoUrl} />
            )}
            <div className="my-5 rounded-md bg-accent px-3 pb-1 pt-2 shadow-lg">
              <h2>
                Student Learning Targets
              </h2>
              {slts.map((slt, i) => (
                <Link
                  key={i}
                  href={`/course/${courseCode}/${moduleCode}/lesson/${slt.moduleIndex}`}
                >
                  <Card intent="slt" size="md" key={slt.id}>
                    <p>
                      {moduleCode}.{slt.moduleIndex}{" "}
                    </p>
                    <div key={slt.moduleIndex} className="col-span-5">
                      {slt.sltText}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
          {editor}
        </>
      );
    }
  }
}
