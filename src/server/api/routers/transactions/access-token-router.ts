import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type AccessTokenMintingParams = {
  user_address: string;
  new_alias: string;
  user_info: string;
};

export const accessTokenTxRouter = createTRPCRouter({
  mintAccessToken: publicProcedure
    .input(
      z.object({
        userAddress: z.string().min(1),
        alias: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const accessTokenMintingParams: AccessTokenMintingParams = {
        user_address: input.userAddress,
        new_alias: input.alias,
        user_info: "Andamio Access Token",
      };
      const unsignedTxCBOR = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        AccessTokenMintingParams
      >(`/tx/access-token/mint`, accessTokenMintingParams);

      if (unsignedTxCBOR) return unsignedTxCBOR;
      else throw new Error("Could not mint access token");
    }),
});
