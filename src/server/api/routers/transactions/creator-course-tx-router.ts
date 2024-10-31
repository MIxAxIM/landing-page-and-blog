import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type ModuleMintingParams = {
  user_access_token: string;
  policy: string;
  module_infos: string;
};

type AssignmentAcceptanceParams = {
  user_access_token: string;
  student_alias: string;
  policy: string;
};

export const creatorCourseTxRouter = createTRPCRouter({
  mintCourseModule: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        courseNftPolicyId: z.string().length(56),
        moduleInfos: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const moduleMintingParams: ModuleMintingParams = {
        user_access_token: input.userAccessTokenUnit,
        policy: input.courseNftPolicyId,
        module_infos: input.moduleInfos,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        ModuleMintingParams
      >(`/tx/course-creator/mint-module-tokens`, moduleMintingParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build minting transaction");
    }),

  acceptAssignment: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        studentAlias: z.string().min(1),
        courseNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const acceptAssignmentParams: AssignmentAcceptanceParams = {
        user_access_token: input.userAccessTokenUnit,
        student_alias: input.studentAlias,
        policy: input.courseNftPolicyId,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        AssignmentAcceptanceParams
      >(`/tx/course-creator/accept-assignment`, acceptAssignmentParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build accept assignment transaction");
    }),

  denyAssignment: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        studentAlias: z.string().min(1),
        courseNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const denyAssignmentParams: AssignmentAcceptanceParams = {
        user_access_token: input.userAccessTokenUnit,
        student_alias: input.studentAlias,
        policy: input.courseNftPolicyId,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        AssignmentAcceptanceParams
      >(`/tx/course-creator/deny-assignment`, denyAssignmentParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build deny assignment transaction");
    }),
});
