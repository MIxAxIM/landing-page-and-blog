
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type ProjectStateMintingParams = {
  user_access_token: string;
  policy: string;
  prerequisite: string;
};

type ProjectStateBurningParams = {
  user_access_token: string;
  policy: string;
};

type GetRewardsParams = {
  user_access_token: string;
  policy: string;
};

export type ProjectCommitmentParams = {
  user_access_token: string;
  policy: string;
  project: string;
  info: string;
}

type ProjectAddInfoParams = {
  user_access_token: string;
  policy: string;
  info: string;
}

export const contributorTxRouter = createTRPCRouter({
  mintProjectState: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        treasuryNftPolicyId: z.string().length(56),
        prerequisite: z.string()
      }),
    )
    .query(async ({ input }) => {
      try {
        const projectStateMintingParams: ProjectStateMintingParams = {
          user_access_token: input.userAccessTokenUnit,
          policy: input.treasuryNftPolicyId,
          prerequisite: input.prerequisite,
        };
        const unsignedTxCBOR = await indexerGetWithParams<
          { unsignedTxCBOR: string },
          ProjectStateMintingParams
        >(`/tx/contributor/mint-project-state`, projectStateMintingParams);
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

  commitProject: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        treasuryNftPolicyId: z.string().length(56),
        project: z.string().min(1),
        info: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      try {
        const projectCommitmentParams: ProjectCommitmentParams = {
          user_access_token: input.userAccessTokenUnit,
          policy: input.treasuryNftPolicyId,
          project: input.project,
          info: input.info,
        };
        const unsignedTxCBOR = await indexerGetWithParams<
          { unsignedTxCBOR: string },
          ProjectCommitmentParams
        >(`/tx/contributor/commit-project`, projectCommitmentParams);

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
        // TODO: Read TRPC docs
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

  addInfo: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        treasuryNftPolicyId: z.string().length(56),
        info: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      try {
        const projectAddInfoParams: ProjectAddInfoParams = {
          user_access_token: input.userAccessTokenUnit,
          policy: input.treasuryNftPolicyId,
          info: input.info,
        };
        const unsignedTxCBOR = await indexerGetWithParams<
          { unsignedTxCBOR: string },
          ProjectAddInfoParams
        >(`/tx/contributor/add-info`, projectAddInfoParams);
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

  burnContributorState: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const burnContributorStateParams: ProjectStateBurningParams = {
          user_access_token: input.userAccessTokenUnit,
          policy: input.treasuryNftPolicyId,
        };
        const unsignedTxCBOR = await indexerGetWithParams<
          { unsignedTxCBOR: string },
          ProjectStateBurningParams
        >(`/tx/contributor/burn-contributor-state`, burnContributorStateParams);
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

  getRewards: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const getRewardsParams: GetRewardsParams = {
          user_access_token: input.userAccessTokenUnit,
          policy: input.treasuryNftPolicyId,
        };
        const unsignedTxCBOR = await indexerGetWithParams<
          { unsignedTxCBOR: string },
          GetRewardsParams
        >(`/tx/contributor/get-rewards`, getRewardsParams);
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

  unlockProject: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const unlockProjectParams: GetRewardsParams = {
          user_access_token: input.userAccessTokenUnit,
          policy: input.treasuryNftPolicyId,
        };
        const unsignedTxCBOR = await indexerGetWithParams<
          { unsignedTxCBOR: string },
          GetRewardsParams
        >(`/tx/contributor/unlock-project`, unlockProjectParams);
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
