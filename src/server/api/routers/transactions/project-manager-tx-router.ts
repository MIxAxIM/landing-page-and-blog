import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type ProjectMintingParams = {
  user_access_token: string;
  policy: string;
  allowed_contributors: string[];
  projects: string;
};

type ProjectAcceptanceParams = {
  user_access_token: string;
  contributor_alias: string;
  policy: string;
};

type TreasuryAddFundsParams = {
  policy: string;
  user_address: string;
  amount: number;
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
      >(`/tx/project-manager/mint-project-tokens`, projectMintingParams);

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
        user_address : input.dipositorsAddress,
        amount : input.adaAmount,
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        TreasuryAddFundsParams
      >(`/tx/treasury/add-funds`, treasuryAddFundsParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not build transaction");
    }),
});
