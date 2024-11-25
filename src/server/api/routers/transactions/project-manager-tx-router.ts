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

export const projectManagerTxRouter = createTRPCRouter({
  mintProjectToken: publicProcedure
    .input(
      z.object({
        userAccessTokenUnit: z.string().min(62),
        treasuryNftPolicyId: z.string().length(56),
        allowedContributors: z.array(z.string().min(1)),
        projects: z.string(),
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

});
