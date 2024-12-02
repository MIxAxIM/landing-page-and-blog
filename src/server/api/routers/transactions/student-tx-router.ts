import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type MintBurnLocalStateParams = {
  user_access_token: string;
  policy: string;
};

type AssignmentCommitmentParams = {
  user_access_token: string;
  policy: string;
  assignment_code: string;
  assignment_info: string;
};

type AssignmentUpdateParams = {
  user_access_token: string;
  policy: string;
  assignment_info: string;
};

type AssignmentLeaveParams = {
  user_access_token: string;
  policy: string;
};

export const studentTxRouter = createTRPCRouter({
  mintLocalState: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        courseNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      console.log("check input", input);
      const mintLocalStateParams: MintBurnLocalStateParams = {
        user_access_token: input.userAccessTokenUnit,
        policy: input.courseNftPolicyId,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        MintBurnLocalStateParams
      >(`/tx/student/mint-local-state`, mintLocalStateParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build minting transaction");
    }),

  burnLocalState: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        courseNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      console.log("check input", input);
      const burnLocalStateParams: MintBurnLocalStateParams = {
        user_access_token: input.userAccessTokenUnit,
        policy: input.courseNftPolicyId,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        MintBurnLocalStateParams
      >(`/tx/student/burn-local-state`, burnLocalStateParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build minting transaction");
    }),

  commitToAssignment: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        courseNftPolicyId: z.string().length(56),
        assignmentCode: z.string().min(1),
        assignmentInfo: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const assignmentCommitmentParams: AssignmentCommitmentParams = {
        user_access_token: input.userAccessTokenUnit,
        policy: input.courseNftPolicyId,
        assignment_code: input.assignmentCode,
        assignment_info: input.assignmentInfo,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        AssignmentCommitmentParams
      >(`/tx/student/commit-to-assignment`, assignmentCommitmentParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build accept assignment transaction");
    }),

  updateAssignment: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        courseNftPolicyId: z.string().length(56),
        assignmentInfo: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const assignmentUpdateParams: AssignmentUpdateParams = {
        user_access_token: input.userAccessTokenUnit,
        policy: input.courseNftPolicyId,
        assignment_info: input.assignmentInfo,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        AssignmentUpdateParams
      >(`/tx/student/update-assignment`, assignmentUpdateParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build accept assignment transaction");
    }),

  leaveAssignment: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        courseNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const assignmentLeaveParams: AssignmentLeaveParams = {
        user_access_token: input.userAccessTokenUnit,
        policy: input.courseNftPolicyId,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        AssignmentLeaveParams
      >(`/tx/student/leave-assignment`, assignmentLeaveParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build accept assignment transaction");
    }),
});
