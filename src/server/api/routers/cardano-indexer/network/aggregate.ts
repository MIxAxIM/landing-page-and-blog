import { type AggregateUserInfoResponse } from "@andamiojs/datum-utils";
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

  getQualifiedTreasuries: protectedProcedure
    .input(
      z.object({
        alias: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      // 1. Get user info from aggregate endpoint
      const userInfoQueryParams: UserInfoQueryParams = {
        alias: input.alias,
      };
      const userInfo = await indexerGetWithParams<
        AggregateUserInfoResponse,
        UserInfoQueryParams
      >(`/aggregate/user-info`, userInfoQueryParams);

      // 2. Get all treasuries with their escrow prerequisites
      const treasuries = await ctx.db.treasury.findMany({
        where: {
          treasuryNftPolicyId: { not: null }, // Only get treasuries with policy IDs
        },
        include: {
          escrows: {
            include: {
              contributorPrerequisites: {
                include: {
                  courseRequirements: {
                    include: {
                      course: {
                        select: {
                          courseNftPolicyId: true
                        }
                      }
                    },
                  },
                },
              },
            },
          },
        },
      });

      // 3. Check each treasury's prerequisites against user's completed courses
      const qualifiedTreasuryNftPolicyIds = treasuries.filter(treasury => {
        // Treasury qualifies if user meets prerequisites for ANY of its escrows
        return treasury.escrows.some(escrow => {
          // Escrow qualifies if user meets ALL of its prerequisites
          return escrow.contributorPrerequisites.every(prerequisite => {
            // Prerequisite qualifies if user meets ALL of its course requirements
            return prerequisite.courseRequirements.every(requirement => {
              // Find matching completed course by policy ID
              const completedCourse = userInfo.courses.completed.find(
                course => course.policy === requirement.course.courseNftPolicyId
              );

              if (!completedCourse) return false;

              // Check if user has completed all required modules
              return requirement.requiredModules.every(
                module => completedCourse.completed_assignments.includes(module)
              );
            });
          });
        });
      })
        .map(treasury => treasury.treasuryNftPolicyId!)
        .filter(Boolean); // Remove any null values

      return qualifiedTreasuryNftPolicyIds;
    }),
});
