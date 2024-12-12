
import { TRPCError } from "@trpc/server";
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

export const courseCreatorTxRouter = createTRPCRouter({
  mintCourseModule: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        courseNftPolicyId: z.string().length(56),
        moduleInfos: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      try {
        const moduleMintingParams: ModuleMintingParams = {
          user_access_token: input.userAccessTokenUnit,
          policy: input.courseNftPolicyId,
          module_infos: input.moduleInfos,
        };
        const unsignedTxCBOR = await indexerGetWithParams<
          { unsignedTxCBOR: string },
          ModuleMintingParams
        >(`/tx/course-creator/mint-module-tokens`, moduleMintingParams);
        if (!unsignedTxCBOR) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Could not build transaction',
          });
        }

        return unsignedTxCBOR;
      }
      catch (error) {
        // Handle specific API errors and convert them to appropriate TRPC errors
        if (error instanceof Error) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
            cause: error,
          });
        }
        throw error;
      }
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
      try {
        const acceptAssignmentParams: AssignmentAcceptanceParams = {
          user_access_token: input.userAccessTokenUnit,
          student_alias: input.studentAlias,
          policy: input.courseNftPolicyId,
        };
        const unsignedTxCBOR = await indexerGetWithParams<
          { unsignedTxCBOR: string },
          AssignmentAcceptanceParams
        >(`/tx/course-creator/accept-assignment`, acceptAssignmentParams);
        if (!unsignedTxCBOR) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Could not build transaction',
          });
        }

        return unsignedTxCBOR;
      }
      catch (error) {
        // Handle specific API errors and convert them to appropriate TRPC errors
        if (error instanceof Error) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
            cause: error,
          });
        }
        throw error;
      }
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
      try {
        const denyAssignmentParams: AssignmentAcceptanceParams = {
          user_access_token: input.userAccessTokenUnit,
          student_alias: input.studentAlias,
          policy: input.courseNftPolicyId,
        };
        const unsignedTxCBOR = await indexerGetWithParams<
          { unsignedTxCBOR: string },
          AssignmentAcceptanceParams
        >(`/tx/course-creator/deny-assignment`, denyAssignmentParams);
        if (!unsignedTxCBOR) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Could not build transaction',
          });
        }

        return unsignedTxCBOR;
      }
      catch (error) {
        // Handle specific API errors and convert them to appropriate TRPC errors
        if (error instanceof Error) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
            cause: error,
          });
        }
        throw error;
      }
    }),
});
