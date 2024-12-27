import { blake2b } from "blakejs";
import { useState, useEffect } from 'react';
import { api } from "~/utils/api";
import { AssignmentNetworkStatus } from "@prisma/client";
import { useAssignmentCommitment } from '~/hooks/db/course/useAssignmentCommitment';
import { type AssignmentCommitment } from '~/types/db';
import { type DecodedAssignmentDecisionDatum } from '@andamiojs/datum-utils';
import useAggregateUserInfo from "../network/useAggregateUserInfo";

type UpdateFunction = (params: {
  id: string;
  networkStatus: AssignmentNetworkStatus;
}) => void;

function handlePendingStudentUpdate(assignments: AssignmentCommitment[], datum: DecodedAssignmentDecisionDatum[], updateFn: UpdateFunction) {
  assignments.forEach(ac => {
    if (!ac.networkEvidenceHash) return;
    datum.forEach(d => {
      if (d.StudentAssignmentInfo?.includes(ac.networkEvidenceHash!)) {
        updateFn({
          id: ac.id,
          networkStatus: "PENDING_APPROVAL"
        })
      }
    })
  });
}

function handlePendingAccept(assignments: AssignmentCommitment[], datum: DecodedAssignmentDecisionDatum[], updateFn: UpdateFunction) {
  assignments.forEach(ac => {
    if (!ac.networkEvidenceHash) return;
    // If evidence hash is no longer in any datum, status changes to ASSIGNMENT_ACCEPTED
    if (!datum.some(d => d.StudentAssignmentInfo?.includes(ac.networkEvidenceHash!))) {
      updateFn({
        id: ac.id,
        networkStatus: "ASSIGNMENT_ACCEPTED"
      });
    }
  });
}

function handlePendingDeny(assignments: AssignmentCommitment[], datum: DecodedAssignmentDecisionDatum[], updateFn: UpdateFunction) {
  assignments.forEach(ac => {
    const _hash = blake2b(Buffer.from(JSON.stringify(ac.networkEvidence)), undefined, 32);
    const _hashString = Buffer.from(_hash).toString("hex");
    if (!datum.some(d => d.StudentAssignmentInfo?.includes(_hashString))) {
      updateFn({
        id: ac.id,
        networkStatus: "ASSIGNMENT_DENIED"
      });
    }
  });
}

function handlePendingLeave(assignments: AssignmentCommitment[], datum: DecodedAssignmentDecisionDatum[], updateFn: UpdateFunction) {
  assignments.forEach(ac => {
    const _hash = blake2b(Buffer.from(JSON.stringify(ac.networkEvidence)), undefined, 32);
    const _hashString = Buffer.from(_hash).toString("hex");
    if (!datum.some(d => d.StudentAssignmentInfo?.includes(_hashString))) {
      updateFn({
        id: ac.id,
        networkStatus: "ASSIGNMENT_LEFT"
      });
    }
  });
}

// TODO: Implement this function
function handlePendingClaimCredential(
  assignments: AssignmentCommitment[],
  updateFn: UpdateFunction
) {
  assignments.forEach(ac => {
    updateFn({
      id: ac.id,
      networkStatus: "CREDENTIAL_CLAIMED"
    })
  })
}

export function useAssignmentCommitmentStatusCheck(courseCode: string, courseNftPolicyId: string) {
  const [isChecking, setIsChecking] = useState(false);
  const { aggregateUserInfo } = useAggregateUserInfo()

  // Get all tasks with PENDING_TX status
  const { data: pendingAssignmentCommitments, isLoading } = api.assignmentCommitment.getAssignmentCommitmentsByCourse.useQuery({
    courseCode: courseCode,
    networkStatuses: [
      AssignmentNetworkStatus.PENDING_TX_ADD_INFO,
      AssignmentNetworkStatus.PENDING_TX_COMMITMENT_MADE,
      AssignmentNetworkStatus.PENDING_TX_ASSIGNMENT_ACCEPTED,
      AssignmentNetworkStatus.PENDING_TX_ASSIGNMENT_DENIED,
      AssignmentNetworkStatus.PENDING_TX_LEAVE_ASSIGNMENT,
      AssignmentNetworkStatus.PENDING_TX_CLAIM_CREDENTIAL,
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
    if (!decodedCourseAssignmentDatum || !pendingAssignmentCommitments) return;
    setIsChecking(true);

    handlePendingStudentUpdate(
      pendingAssignmentCommitments.filter(ac =>
        ac.networkStatus === "PENDING_TX_ADD_INFO" || ac.networkStatus === "PENDING_TX_COMMITMENT_MADE"
      ),
      decodedCourseAssignmentDatum,
      updateNetworkStatus
    );
    handlePendingAccept(pendingAssignmentCommitments.filter(ac => ac.networkStatus === "PENDING_TX_ASSIGNMENT_ACCEPTED"), decodedCourseAssignmentDatum, updateNetworkStatus);
    handlePendingDeny(pendingAssignmentCommitments.filter(ac => ac.networkStatus === "PENDING_TX_ASSIGNMENT_DENIED"), decodedCourseAssignmentDatum, updateNetworkStatus);
    handlePendingLeave(pendingAssignmentCommitments.filter(ac => ac.networkStatus === "PENDING_TX_LEAVE_ASSIGNMENT"), decodedCourseAssignmentDatum, updateNetworkStatus);
    if (aggregateUserInfo) {
      handlePendingClaimCredential(
        pendingAssignmentCommitments.filter(ac => ac.networkStatus === "PENDING_TX_CLAIM_CREDENTIAL"),
        updateNetworkStatus
      );
    }

  }, [pendingAssignmentCommitments, decodedCourseAssignmentDatum, aggregateUserInfo, updateNetworkStatus]);

  return { isChecking, isLoading };
}
