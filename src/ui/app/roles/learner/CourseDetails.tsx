import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import useCourse from "~/hooks/course/useCourse";
import { type LearnerAssignment } from "~/hooks/course/useLearnerAssignmentStatuses";
import AssignmentsSection from "./AssignmentSection";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import useLearnerSavedCourses from "~/hooks/course/useLearnerSavedCourses";
import LearnerCourseModuleDetailsComponent from "./LearnerCourseModuleDetailsComponent";
import useCourseModuleWithAssignmentSummary from "~/hooks/course/useCourseModuleWithAssignmentSummary";
import { Skeleton } from "~/components/ui/skeleton";
import BurnLocalStateMeshDialog from "~/components/transactions/dialogs/BurnLocalStateMeshDialog";
import { useAccessToken } from "~/hooks/onchain/useAccessToken";
import { type DecodedGlobalStateDatum } from "@andamiojs/datum-utils";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import useCourseStateDatum from "~/hooks/onchain/useCourseStateDatum";

export default function CourseDetails({
  currentCourseCode,
  learnerAssignments,
  globalStateDatum,
}: {
  currentCourseCode: string;
  learnerAssignments: LearnerAssignment[];
  globalStateDatum: DecodedGlobalStateDatum | undefined;
}) {
  const ctx = api.useUtils();
  const { data: sessionData, update: updateSessionData } = useSession();
  const { connected } = useWallet();
  const { course, isLoadingCourse } = useCourse(currentCourseCode);
  const { courseModuleOverviews } =
    useCourseModuleWithAssignmentSummary(currentCourseCode);
  const { savedCourses } = useLearnerSavedCourses();
  const [isCourseSaved, setIsCourseSaved] = useState<boolean>(true);
  const [courseAssignments, setCourseAssignments] = useState<
    LearnerAssignment[]
  >([]);
  const [learnerCourseStatus, setLearnerCourseStatus] = useState<
    "NEVER_ENROLLED" | "ENROLLED" | "WAS_ENROLLED"
  >("NEVER_ENROLLED");

  const { accessTokenAsset, accessTokenAlias } = useAccessToken();
  const { courseStateDatum } = useCourseStateDatum(
    course?.onchainInstance[0]?.CourseCreatorNFTPolicyID ?? "",
    accessTokenAlias ?? "",
  );

  const { mutate: saveCourseForLearner } =
    api.learner.saveCourseForLearner.useMutation({
      onSuccess: () => {
        void ctx.learner.getSavedCoursesByLearner.invalidate();
        void updateSessionData();
        toast.success("Course saved");
      },
    });

  const { mutate: unsaveCourseForLearner } =
    api.learner.removeSavedCourseForLearner.useMutation({
      onSuccess: () => {
        void ctx.learner.getSavedCoursesByLearner.invalidate();
        void updateSessionData();
        toast.success("Course removed");
      },
    });

  useEffect(() => {
    if (learnerAssignments && !!course) {
      const res = learnerAssignments.filter(
        (a) => a.courseCode === course.courseCode,
      );
      setCourseAssignments(res);
    }
  }, [course, learnerAssignments]);

  useEffect(() => {
    if (savedCourses) {
      const saved = savedCourses.find(
        (c) => c.courseCode === currentCourseCode,
      );
      setIsCourseSaved(!!saved);
    }
  }, [savedCourses, currentCourseCode]);

  useEffect(() => {
    const _course = globalStateDatum?.TokenInfos.find(
      (ti) => ti.LsCs == course?.onchainInstance[0]?.CourseCreatorNFTPolicyID,
    );
    if (_course?.Minted) {
      setLearnerCourseStatus("ENROLLED");
    } else if (!!_course && !_course.Minted) {
      setLearnerCourseStatus("WAS_ENROLLED");
    }
  }, [courseStateDatum, globalStateDatum, course]);

  const handleSaveCourse = () => {
    if (sessionData && course?.id) {
      saveCourseForLearner({
        learnerId: sessionData.user.learnerId,
        courseId: course.id,
      });
    }
  };

  const handleUnsaveCourse = () => {
    if (sessionData && course?.id) {
      unsaveCourseForLearner({
        learnerId: sessionData.user.learnerId,
        courseId: course.id,
      });
    }
  };

  if (isLoadingCourse)
    return (
      <div className="mx-auto flex min-h-[500px] w-11/12 flex-col justify-center">
        <Image src="/andamio.png" width={200} height={200} alt="loading" />
        <Skeleton className="my-2 h-[20px] w-3/4 rounded-full bg-primary opacity-50" />
        <Skeleton className="my-2 h-[20px] w-3/4 rounded-full bg-primary opacity-50" />
        <Skeleton className="my-2 h-[20px] w-3/4 rounded-full bg-primary opacity-50" />
        <Skeleton className="my-2 h-[20px] w-3/4 rounded-full bg-primary opacity-50" />
      </div>
    );

  return (
    <div className="mx-auto w-11/12 px-5" key={course?.id}>
      <div className=" flex min-h-[150px] w-full flex-col">
        <div className="mb-12 flex w-full flex-row items-center justify-between">
          <h1>{course?.title}</h1>
          {course?.imageUrl && (
            <div className="flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.imageUrl}
                className="max-h-[100px]"
                alt="course image"
              />
            </div>
          )}
        </div>
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-row gap-3">
            {learnerCourseStatus === "ENROLLED" && (
              <>
                {accessTokenAsset &&
                  course?.onchainInstance[0]?.CourseCreatorNFTPolicyID && (
                    <BurnLocalStateMeshDialog
                      accessTokenAssetId={accessTokenAsset.unit}
                      courseNftPolicyId={
                        course?.onchainInstance[0]?.CourseCreatorNFTPolicyID
                      }
                    />
                  )}
              </>
            )}

            {learnerCourseStatus === "NEVER_ENROLLED" && (
              <>
                <Button size="sm">Enroll on Andamio Network</Button>
                {isCourseSaved ? (
                  <Button size="sm" onClick={handleUnsaveCourse}>
                    Remove from Saved List
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleSaveCourse}>
                    Save for Later
                  </Button>
                )}
              </>
            )}

            {learnerCourseStatus === "WAS_ENROLLED" && (
              <>
                <Button size="sm">Enroll Again!</Button>
                {isCourseSaved ? (
                  <Button size="sm" onClick={handleUnsaveCourse}>
                    Remove from Saved List
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleSaveCourse}>
                    Save for Later
                  </Button>
                )}
              </>
            )}
          </div>
          <div className="flex flex-row items-center gap-4">
            {!connected && <CardanoWallet />}
            <Link href={`/course/${course?.courseCode}`}>
              <Button size="xl">Open Course</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="">
        <h2>{course?.description}</h2>
        <h2>{course?.title} Outline</h2>
        {courseModuleOverviews
          ?.sort((a, b) => {
            return a.moduleCode.localeCompare(b.moduleCode);
          })
          .map((cm, i) => (
            <LearnerCourseModuleDetailsComponent
              alias={accessTokenAlias ?? ""}
              courseModule={cm}
              courseStateDatum={courseStateDatum}
              courseTokenInfo={globalStateDatum?.TokenInfos.find(
                (ti) =>
                  ti.LsCs ===
                  course?.onchainInstance[0]?.CourseCreatorNFTPolicyID,
              )}
              learnerCourseStatus={learnerCourseStatus}
              key={i}
            />
          ))}
        {!!courseAssignments && (
          <div className="mt-12 border-t border-primary">
            <AssignmentsSection learnerAssignments={courseAssignments} />
          </div>
        )}
      </div>
    </div>
  );
}
