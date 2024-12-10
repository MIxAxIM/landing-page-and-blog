
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
      const projectStateMintingParams: ProjectStateMintingParams = {
        user_access_token: input.userAccessTokenUnit,
        policy: input.treasuryNftPolicyId,
        prerequisite: input.prerequisite,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        ProjectStateMintingParams
      >(`/tx/contributor/mint-project-state`, projectStateMintingParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build transaction");
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

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build transaction");
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
      const projectAddInfoParams: ProjectAddInfoParams = {
        user_access_token: input.userAccessTokenUnit,
        policy: input.treasuryNftPolicyId,
        info: input.info,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        ProjectAddInfoParams
      >(`/tx/contributor/add-info`, projectAddInfoParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build transaction");
    }),

  burnContributorState: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const burnContributorStateParams: ProjectStateBurningParams = {
        user_access_token: input.userAccessTokenUnit,
        policy: input.treasuryNftPolicyId,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        ProjectStateBurningParams
      >(`/tx/contributor/burn-contributor-state`, burnContributorStateParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build transaction");
    }),

  getRewards: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const getRewardsParams: GetRewardsParams = {
        user_access_token: input.userAccessTokenUnit,
        policy: input.treasuryNftPolicyId,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        GetRewardsParams
      >(`/tx/contributor/get-rewards`, getRewardsParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build transaction");
    }),

  unlockProject: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const unlockProjectParams: GetRewardsParams = {
        user_access_token: input.userAccessTokenUnit,
        policy: input.treasuryNftPolicyId,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        GetRewardsParams
      >(`/tx/contributor/unlock-project`, unlockProjectParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build transaction");
    }),
});
