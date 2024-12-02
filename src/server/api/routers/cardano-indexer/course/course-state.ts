import { z } from "zod";
import { type DecodedCourseStateDatum } from "@andamiojs/datum-utils";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { indexerGetWithParams } from "~/lib/axios/indexer";

type CourseStateQueryParams = {
  policy: string;
  alias: string;
};

export const courseStateRouter = createTRPCRouter({
  getCourseStateDatumByAlias: protectedProcedure
    .input(
      z.object({
        courseNftPolicy: z.string().length(56),
        alias: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const courseStateQueryParams: CourseStateQueryParams = {
        policy: input.courseNftPolicy,
        alias: input.alias,
      };
      const localStateValidator = indexerGetWithParams<
        DecodedCourseStateDatum,
        CourseStateQueryParams
      >(
        "/course-state/decoded-datum",
        courseStateQueryParams,
      );
      return localStateValidator;
    }),
});
