import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type ProjectMintingParams = {
  user_access_token: string;
  policy: string;
  allowed_contributors: string[];
  projects: string;
};

type ProjectAcceptDenyParams = {
  user_access_token: string;
  contributor_alias: string;
  policy: string;
};

type TreasuryAddFundsParams = {
  policy: string;
  user_address: string;
  amount: string;
};

// NOTE:
// projects is a stringified object
// https://github.com/Andamio-Platform/andamio-dev/blob/preprod/apps/express_api/test/mint_project_token.md

export const projectCreatorTxRouter = createTRPCRouter({
  mintProjectToken: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        treasuryNftPolicyId: z.string().length(56),
        allowedContributors: z.array(z.string().min(1)),
        projects: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      try {
        const projectMintingParams: ProjectMintingParams = {
          user_access_token: input.userAccessTokenUnit,
          policy: input.treasuryNftPolicyId,
          allowed_contributors: input.allowedContributors,
          projects: input.projects,
        };
        const unsignedTxCBOR = await indexerGetWithParams<
          { unsignedTxCBOR: string },
          ProjectMintingParams
        >(`/tx/project-creator/mint-treasury-token`, projectMintingParams);

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


  manageTreasuryToken: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        treasuryNftPolicyId: z.string().length(56),
        allowedContributors: z.array(z.string().min(1)),
        projects: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      try {
        const manageTreasuryTokenParams: ProjectMintingParams = {
          user_access_token: input.userAccessTokenUnit,
          policy: input.treasuryNftPolicyId,
          allowed_contributors: input.allowedContributors,
          projects: input.projects,
        };
        const unsignedTxCBOR = await indexerGetWithParams<
          { unsignedTxCBOR: string },
          ProjectMintingParams
        >(`/tx/project-creator/manage-treasury-token`, manageTreasuryTokenParams);
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

  acceptProject: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        contributorAlias: z.string().min(1),
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const projectAcceptParams: ProjectAcceptDenyParams = {
          user_access_token: input.userAccessTokenUnit,
          contributor_alias: input.contributorAlias,
          policy: input.treasuryNftPolicyId,
        };
        const unsignedTxCBOR = await indexerGetWithParams<
          { unsignedTxCBOR: string },
          ProjectAcceptDenyParams
        >(`/tx/project-creator/accept-project`, projectAcceptParams);

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

  denyProject: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        contributorAlias: z.string().min(1),
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const projectDenyParams: ProjectAcceptDenyParams = {
          user_access_token: input.userAccessTokenUnit,
          contributor_alias: input.contributorAlias,
          policy: input.treasuryNftPolicyId,
        };
        const unsignedTxCBOR = await indexerGetWithParams<
          { unsignedTxCBOR: string },
          ProjectAcceptDenyParams
        >(`/tx/project-creator/deny-project`, projectDenyParams);
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

  refuseProject: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        contributorAlias: z.string().min(1),
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const projectDenyParams: ProjectAcceptDenyParams = {
          user_access_token: input.userAccessTokenUnit,
          contributor_alias: input.contributorAlias,
          policy: input.treasuryNftPolicyId,
        };
        const unsignedTxCBOR = await indexerGetWithParams<
          { unsignedTxCBOR: string },
          ProjectAcceptDenyParams
        >(`/tx/project-creator/refuse-project`, projectDenyParams);
        if (!unsignedTxCBOR) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Could not build Refuse Project transaction',
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

  addFunds: publicProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
        dipositorsAddress: z.string(),
        adaAmount: z.number(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const treasuryAddFundsParams: TreasuryAddFundsParams = {
          policy: input.treasuryNftPolicyId,
          user_address: input.dipositorsAddress,
          amount: input.adaAmount.toString(),
        };
        const unsignedTxCBOR = await indexerGetWithParams<
          { unsignedTxCBOR: string },
          TreasuryAddFundsParams
        >(`/tx/treasury/add-funds`, treasuryAddFundsParams);
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
});




