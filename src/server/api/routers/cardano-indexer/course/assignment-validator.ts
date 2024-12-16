import { z } from "zod";
import {
  type DecodedAssignmentDecisionDatum,
  type DecodedModuleRefDatum,
} from "@andamiojs/datum-utils";
import { indexerGet } from "~/lib/axios/indexer";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

type OnchainCourseModule = {
  module_token: string;
  decoded_datum: DecodedModuleRefDatum;
};

export const assignmentValidatorRouter = createTRPCRouter({
  isCourseModuleOnchain: publicProcedure
    .input(
      z.object({
        courseCreatorNFTPolicyID: z.string().length(56),
        moduleCode: z.string().min(3),
      }),
    )
    .query(async ({ input }) => {
      const onchainCourseModules = await indexerGet<OnchainCourseModule[]>(
        `/module-ref-validator/decoded-datums?policy=${input.courseCreatorNFTPolicyID}`,
      );
      if (
        onchainCourseModules.some((m) => m.module_token === input.moduleCode)
      ) {
        return true;
      } else {
        return false;
      }
    }),

  isLearnerCommittedToAssignment: protectedProcedure
    .input(
      z.object({
        courseCreatorNFTPolicyID: z.string().length(56),
        assignmentCode: z.string().min(3),
        alias: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      try {
        console.log("hhh", input);
        const assignment = await indexerGet<DecodedAssignmentDecisionDatum>(
          `/assignment-validator/decoded-datum?policy=${input.courseCreatorNFTPolicyID}&alias=${input.alias}`,
        );
        console.log("hhhsac", assignment);
        if (assignment.CommittedAssignmentId === input.assignmentCode) {
          return true;
        } else {
          return false;
        }
      } catch {
        return false;
      }
    }),

  getDecodedCourseAssignmentDatums: protectedProcedure
    .input(
      z.object({
        courseNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const assignments = await indexerGet<DecodedAssignmentDecisionDatum[]>(
        `/assignment-validator/decoded-datum?policy=${input.courseNftPolicyId}`,
      );
      return assignments;
    }),

  getDecodedCourseAssignmentDatumsByAlias: protectedProcedure
    .input(
      z.object({
        courseCreatorNFTPolicyID: z.string().length(56),
        alias: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const assignments = await indexerGet<DecodedAssignmentDecisionDatum>(
        `/assignment-validator/decoded-datum?policy=${input.courseCreatorNFTPolicyID}&alias=${input.alias}`,
      );
      return assignments;
    }),

  getCourseAssignmentStats: protectedProcedure
    .input(
      z.object({
        courseCode: z.string().min(1),
        courseCreatorNFTPolicyID: z.string().length(56),
      }),
    )
    .query(async ({ input, ctx }) => {
      const res = await ctx.db.course.findFirst({
        where: {
          courseCode: input.courseCode,
        },
        include: {
          modules: {
            include: {
              assignments: true,
            },
          },
        },
      });

      if (!res) {
        throw new Error("Course not found");
      }

      // TODO: Pick up here 2024-08-28

      const assignmentModules = res.modules.filter(
        (cM) => cM.assignments.length > 0,
      );

      const onchainCourseModules = await indexerGet<OnchainCourseModule[]>(
        `/module-ref-validator/decoded-datums?policy=${input.courseCreatorNFTPolicyID}`,
      );

      return {
        courseModules: res.modules.length,
        modulesWithAssignments: assignmentModules.length,
        networkPublishedModules: onchainCourseModules.length,
      };
      //   (cm: CourseModuleOverview) => cm.assignments && cm.assignments.length > 0,
      // );
      //
      // return modulesWithAssignments.length;
    }),
});
