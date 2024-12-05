import { AggregateUserInfoResponse } from "@andamiojs/datum-utils";
import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

type UserInfoQueryParams = {
  alias: string;
};

export const aggregateRouter = createTRPCRouter({
  getUserInfo: protectedProcedure
    .input(
      z.object({
        alias: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const userInfoQueryParams: UserInfoQueryParams = {
        alias: input.alias,
      };
      const response = indexerGetWithParams<
        AggregateUserInfoResponse,
        UserInfoQueryParams
      >(`/aggregate/user-info`, userInfoQueryParams);
      return response;
    }),
});
