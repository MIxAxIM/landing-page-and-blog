import { useState, useEffect } from 'react';
import { api } from "~/utils/api";
import { AssignmentNetworkStatus, TaskStatus } from "@prisma/client";
import { useAssignmentCommitment } from '~/hooks/db/course/useAssignmentCommitment';

export function useAssignmentCommitmentStatusCheck(courseCode: string, courseNftPolicyId: string) {
  const [isChecking, setIsChecking] = useState(false);

  // Get all tasks with PENDING_TX status
  const { data: pendingAssignmentCommitments, isLoading } = api.assignmentCommitment.getAssignmentCommitmentsByCourse.useQuery({
    courseCode: courseCode,
    networkStatuses: [
      AssignmentNetworkStatus.PENDING_TX_ADD_INFO,
      AssignmentNetworkStatus.PENDING_TX_COMMITMENT_MADE,
      AssignmentNetworkStatus.PENDING_TX_ASSIGNMENT_ACCEPTED,
      AssignmentNetworkStatus.PENDING_TX_ASSIGNMENT_DENIED
    ]
  });

  // Assignment Commitment Status mutation
  const { updateNetworkStatus } = useAssignmentCommitment({});

  // Source of cardano on-chain data
  const { data: decodedCourseAssignmentDatum } = api.assignmentValidator.getDecodedCourseAssignmentDatums.useQuery(
    { courseNftPolicyId: courseNftPolicyId },
    {
      enabled: !!courseNftPolicyId && courseNftPolicyId.length === 56 && !!pendingAssignmentCommitments && pendingAssignmentCommitments.length > 0,
      refetchInterval: 10000
    }
  );

  useEffect(() => {
    pendingAssignmentCommitments?.filter(ac => ac.networkStatus === AssignmentNetworkStatus.PENDING_TX_ASSIGNMENT_ACCEPTED)
      .forEach(ac => {
        if (!!ac.networkEvidenceHash && !decodedCourseAssignmentDatum?.find(d => d.StudentAssignmentInfo?.includes(ac.networkEvidenceHash!))) {
          updateNetworkStatus({
            id: ac.id,
            networkStatus: AssignmentNetworkStatus.ASSIGNMENT_ACCEPTED
          });
        }
      })
    if (!decodedCourseAssignmentDatum || !pendingAssignmentCommitments) return;

    setIsChecking(true);

    for (const datum of decodedCourseAssignmentDatum) {
      for (const ac of pendingAssignmentCommitments) {
        if (ac.networkEvidenceHash && datum.StudentAssignmentInfo?.includes(ac.networkEvidenceHash)) {
          updateNetworkStatus({
            id: ac.id,
            networkStatus: ac.networkStatus === "PENDING_TX_ASSIGNMENT_DENIED" ? AssignmentNetworkStatus.ASSIGNMENT_DENIED : AssignmentNetworkStatus.PENDING_APPROVAL
          });
        }
      }
    }
  }, [pendingAssignmentCommitments, decodedCourseAssignmentDatum]);

  return { isChecking, isLoading };
}
