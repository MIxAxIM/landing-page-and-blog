import { TRPCError } from "@trpc/server";
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
      try {
        const accessTokenMintingParams: AccessTokenMintingParams = {
          user_address: input.userAddress,
          new_alias: input.alias,
          user_info: "Andamio Access Token",
        };
        const unsignedTxCBOR = await indexerGetWithParams<
          { unsignedTxCBOR: string },
          AccessTokenMintingParams
        >(`/tx/access-token/mint`, accessTokenMintingParams);
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
