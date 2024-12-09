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

export const projectManagerTxRouter = createTRPCRouter({
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
      const projectMintingParams: ProjectMintingParams = {
        user_access_token: input.userAccessTokenUnit,
        policy: input.treasuryNftPolicyId,
        allowed_contributors: input.allowedContributors,
        projects: input.projects,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        ProjectMintingParams
      >(`/tx/project-manager/mint-project-token`, projectMintingParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build minting transaction");
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
      const manageTreasuryTokenParams: ProjectMintingParams = {
        user_access_token: input.userAccessTokenUnit,
        policy: input.treasuryNftPolicyId,
        allowed_contributors: input.allowedContributors,
        projects: input.projects,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        ProjectMintingParams
      >(`/tx/project-manager/manage-treasury-token`, manageTreasuryTokenParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build minting transaction");
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
      const projectAcceptParams: ProjectAcceptDenyParams = {
        user_access_token: input.userAccessTokenUnit,
        contributor_alias: input.contributorAlias,
        policy: input.treasuryNftPolicyId,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        ProjectAcceptDenyParams
      >(`/tx/project-manager/accept-project`, projectAcceptParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build minting transaction");
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
      const projectDenyParams: ProjectAcceptDenyParams = {
        user_access_token: input.userAccessTokenUnit,
        contributor_alias: input.contributorAlias,
        policy: input.treasuryNftPolicyId,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        ProjectAcceptDenyParams
      >(`/tx/project-manager/deny-project`, projectDenyParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build minting transaction");
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
      const treasuryAddFundsParams: TreasuryAddFundsParams = {
        policy: input.treasuryNftPolicyId,
        user_address: input.dipositorsAddress,
        amount: input.adaAmount.toString(),
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        TreasuryAddFundsParams
      >(`/tx/treasury/add-funds`, treasuryAddFundsParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build transaction");
    }),
});
