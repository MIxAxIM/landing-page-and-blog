import { z } from "zod";

import { indexerGetWithParams } from "~/lib/axios/indexer";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


// TODO:
// Add return type from datum-utils

interface Course {
  completed: string[];
  ongoing: string[];
}

interface Projects {
  completed: string[];
  ongoing: string[];
}

interface TempUserInfoResponse {
  alias: string;
  userInfo: string;
  courses: Course;
  projects: Projects;
}


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
        TempUserInfoResponse,
        UserInfoQueryParams
      >(`/aggregate/user-info`, userInfoQueryParams);
      return response;
    }),
});
