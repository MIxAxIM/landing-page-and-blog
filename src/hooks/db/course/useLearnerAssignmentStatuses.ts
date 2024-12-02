import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { type AssignmentCommitment } from "~/types/db";
import { api } from "~/utils/api";

export type LearnerAssignment = {
  id: string;
  title: string;
  assignmentCode: string;
  courseTitle: string;
  courseCode: string;
  moduleTitle: string;
  moduleCode: string;
  status: "SAVE_FOR_LATER" | "IN_PROGRESS" | "COMPLETE" | "COMMITMENT";
  learnerNote: string;
  archived: boolean;
};

export function useLearnerAssignmentStatuses() {
  const ctx = api.useUtils();
  const { data: sessionData, update: updateSession } = useSession();

  const [assignmentStatuses, setAssignmentStatuses] = useState<
    AssignmentCommitment[]
  >([]);
  const [learnerAssignments, setLearnerAssignments] = useState<
    LearnerAssignment[]
  >([]);

  const {
    data: assignmentInfo,
    isLoading,
    isError,
  } = api.assignment.getAssignments.useQuery(
    {
      assignmentIds:
        sessionData?.user.assignmentCommitments.map((a) => a.assignmentId) ??
        [],
    },
    {
      enabled: !!sessionData && !!sessionData.user.assignmentCommitments,
      staleTime: 30000,
    },
  );

  useEffect(() => {
    if (sessionData) {
      setAssignmentStatuses(sessionData.user.assignmentCommitments);
    }
  }, [sessionData, ctx]);

  useEffect(() => {
    if (assignmentInfo && assignmentStatuses) {
      const _laList: LearnerAssignment[] = [];
      assignmentStatuses.forEach((as) => {
        const aInfo = assignmentInfo.find((aI) => aI.id === as.assignmentId);

        if (aInfo) {
          const _la: LearnerAssignment = {
            id: as.assignmentCommitmentId,
            title: aInfo.title,
            assignmentCode: aInfo.assignmentCode,
            courseTitle: aInfo.module.originalCourse.title,
            courseCode: aInfo.module.originalCourse.courseCode,
            moduleTitle: aInfo.module.title,
            moduleCode: aInfo.module.moduleCode,
            status: as.status,
            learnerNote: as.learnerNotes,
            archived: as.archived,
          };
          _laList.push(_la);
        }
      });
      setLearnerAssignments(_laList);
    }
  }, [assignmentInfo, assignmentStatuses]);

  return {
    assignmentStatuses,
    assignmentInfo,
    learnerAssignments,
    isLoading,
    isError,
    sessionData,
    updateSession,
  };
}
