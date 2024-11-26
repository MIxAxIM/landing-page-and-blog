import { useEffect, useState } from "react";
import useCourseByPolicyId from "~/hooks/onchain/useCourseByPolicyId";
import useCourseStateDatum from "~/hooks/onchain/useCourseStateDatum";
import LoadingCircle from "~/ui/studio/components/ContentEditor/ui/icons/loading-circle";
import Link from "next/link";
import { type LearnerAssignment } from "~/hooks/course/useLearnerAssignmentStatuses";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import useAssignmentDatums from "~/hooks/onchain/useAssignmentDatums";

export default function CurrentCourseListItem({
  lsCs,
  alias,
  learnerAssignments,
  key,
}: {
  lsCs: string;
  alias: string;
  learnerAssignments: LearnerAssignment[];
  key: number;
}) {
  const { courseInfo, isLoadingCourseInfo, assignmentStats } =
    useCourseByPolicyId(lsCs);
  const {
    courseStateDatum,
    isLoadingCourseStateDatum,
    isErrorCourseStateDatum,
    errorCourseStateDatum,
  } = useCourseStateDatum(lsCs, alias);

  const { assignmentDatum, isLoadingAssignmentDatum, isErrorAssignmentDatum } =
    useAssignmentDatums(lsCs, alias);

  const [courseAssignments, setCourseAssignments] = useState<
    LearnerAssignment[]
  >([]);

  const [completedCredentials, setCompletedCredentials] = useState<
    number | undefined
  >(undefined);

  const [completedAssignments, setCompletedAssignments] = useState<
    number | undefined
  >(undefined);

  const [completionPercentage, setCompletionPercentage] =
    useState<string>("Not Available");

  const [credentialPercentage, setCredentialPercentage] =
    useState<string>("Not Available");

  useEffect(() => {
    if (learnerAssignments && !!courseInfo) {
      const res = learnerAssignments.filter(
        (a) => a.courseCode === courseInfo.courseCode,
      );
      setCourseAssignments(res);
    }
  }, [courseInfo, learnerAssignments]);

  useEffect(() => {
    if (!!courseStateDatum) {
      const _assignments = courseStateDatum.CompletedAssignments.length;
      setCompletedCredentials(_assignments);
    } else if (!!assignmentDatum) {
      const _assignments =
        assignmentDatum.CourseState.CompletedAssignments.length;
      setCompletedCredentials(_assignments);
    }
  }, [courseStateDatum, assignmentDatum]);

  useEffect(() => {
    if (
      completedCredentials &&
      assignmentStats &&
      assignmentStats.networkPublishedModules > 0
    ) {
      const _ratio: number =
        completedCredentials / assignmentStats.networkPublishedModules;
      const _percentage: number = _ratio * 100;
      const _rounded_percentage: number = Math.round(_percentage * 10) / 10;
      setCredentialPercentage(_rounded_percentage.toString() + "%");
    }
  }, [completedCredentials, assignmentStats]);

  useEffect(() => {
    if (courseAssignments) {
      const _complete = courseAssignments.filter(
        (ca) => ca.status === "COMPLETE",
      );
      setCompletedAssignments(_complete.length);
    }
  }, [courseAssignments]);

  useEffect(() => {
    if (
      completedAssignments &&
      assignmentStats &&
      assignmentStats.networkPublishedModules > 0
    ) {
      const _ratio: number =
        completedAssignments / assignmentStats.modulesWithAssignments;
      const _percentage: number = _ratio * 100;
      const _rounded_percentage: number = Math.round(_percentage * 10) / 10;
      setCompletionPercentage(_rounded_percentage.toString() + "%");
    }
  }, [completedAssignments, assignmentStats]);

  if (isLoadingCourseInfo) return <LoadingCircle />;

  if (isLoadingCourseStateDatum && !assignmentDatum) {
    return <LoadingCircle />;
  }

  if (isLoadingAssignmentDatum && !courseStateDatum) {
    return <LoadingCircle />;
  }

  if (isErrorCourseStateDatum && isErrorAssignmentDatum) {
    return (
      <div>
        <p>ERROR</p>
        <p>{lsCs}</p>
        <p>{alias}</p>
        <pre>{JSON.stringify(errorCourseStateDatum, null, 2)}</pre>
      </div>
    );
  }

  return (
    <Link href={`/app/learn/${courseInfo?.courseCode}`}>
      <div key={key} className="my-3 flex flex-col">
        <div className="flex w-full flex-col items-center bg-primary px-3 py-2 text-primary-foreground md:flex-row md:justify-between">
          <div className="text-xl font-semibold">{courseInfo?.title}</div>
          <div className="flex flex-row items-center gap-1">
            <QuestionMarkCircledIcon />
            <p>Assignments Complete: {completionPercentage} </p>
          </div>
          <div className="flex flex-row items-center gap-1">
            <QuestionMarkCircledIcon />
            <p>Credentials Earned: {credentialPercentage}</p>
          </div>
        </div>
        <div className="my-3 grid w-full grid-cols-1 md:grid-cols-2">
          <div>
            <ul className="ml-3 list-disc pl-5">
              <li className="my-1">
                Total Modules: {assignmentStats?.courseModules}
              </li>
              <li className="my-1">
                Assignments: {assignmentStats?.modulesWithAssignments}
              </li>
              <li className="my-1">
                Credentials to Earn: {assignmentStats?.networkPublishedModules}
              </li>
            </ul>
          </div>
          <div>
            <ul className="ml-3 list-disc pl-5">
              <li className="my-1">
                Your Completed Assignments: {completedAssignments} out of{" "}
                {assignmentStats?.modulesWithAssignments}
              </li>
              <li className="my-1">
                Your Credentials Earned: {completedCredentials} out of{" "}
                {assignmentStats?.networkPublishedModules}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Link>
  );
}
