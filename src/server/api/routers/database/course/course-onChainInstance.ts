import { Network } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const courseOnChainInstanceRouter = createTRPCRouter({
  getAllCoursesOnchain: publicProcedure.query(({ ctx }) => {
    return ctx.db.courseOnChainInstance.findMany();
  }),

  getCourseOnchainInstances: publicProcedure
    .input(
      z.object({
        courseCode: z.string().min(1),
        network: z.nativeEnum(Network),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.courseOnChainInstance.findFirst({
        where: {
          courseCode: input.courseCode,
          network: input.network,
        },
        include: {
          course: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        courseCode: z.string().min(1),
        network: z.nativeEnum(Network),
        CourseCreatorNFTPolicyID: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.courseOnChainInstance.create({
        data: {
          network: input.network,
          CourseCreatorNFTPolicyID: input.CourseCreatorNFTPolicyID ?? "",
          course: {
            connect: {
              courseCode: input.courseCode,
            },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        network: z.nativeEnum(Network),
        CourseCreatorNFTPolicyID: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.courseOnChainInstance.update({
        where: {
          id: input.id,
        },
        data: {
          network: input.network,
          CourseCreatorNFTPolicyID: input.CourseCreatorNFTPolicyID ?? "",
        },
      });
    }),

  getCourseByCourseNftPolicy: publicProcedure
    .input(z.object({ CourseCreatorNFTPolicyID: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const courseOnChainInstance =
        await ctx.db.courseOnChainInstance.findFirst({
          where: {
            CourseCreatorNFTPolicyID: input.CourseCreatorNFTPolicyID,
          },
          include: {
            course: true,
          },
        });

      if (!courseOnChainInstance || !courseOnChainInstance.course) {
        throw new Error(
          "Course not found for the provided CourseCreatorNFTPolicyID",
        );
      }

      return {
        courseCode: courseOnChainInstance.course.courseCode,
        title: courseOnChainInstance.course.title,
      };
    }),

  getCoursesByNftPolicyList: publicProcedure
    .input(z.object({ CourseCreatorNFTPolicyIDs: z.array(z.string().min(1)) }))
    .query(async ({ ctx, input }) => {
      const courseOnChainInstances =
        await ctx.db.courseOnChainInstance.findMany({
          where: {
            CourseCreatorNFTPolicyID: { in: input.CourseCreatorNFTPolicyIDs },
          },
          include: {
            course: true,
          },
        });

      if (courseOnChainInstances.length === 0) {
        throw new Error(
          "No courses found in the provided list of Course Policy IDs",
        );
      }
      // Filter out any instances where course is null and map to desired format
      return courseOnChainInstances
        .filter(
          (
            instance,
          ): instance is typeof instance & {
            course: NonNullable<typeof instance.course>;
          } => instance.course !== null,
        )
        .map((instance) => ({
          courseCode: instance.course.courseCode,
          title: instance.course.title,
        }));
    }),

  getCourseNftPolicyIds: publicProcedure
    .input(z.object({ courseCodes: z.array(z.string().min(3)) }))
    .query(async ({ ctx, input }) => {
      const coursePolicies = await Promise.all(
        input.courseCodes.map(async (courseCode) => {
          const courseOnChainInstance =
            await ctx.db.courseOnChainInstance.findFirst({
              where: {
                courseCode: courseCode,
              },
            });
          return {
            courseCode: courseCode,
            courseCreatorNFTPolicyId:
              courseOnChainInstance?.CourseCreatorNFTPolicyID ?? undefined,
          };
        }),
      );

      return coursePolicies;
    }),
});
