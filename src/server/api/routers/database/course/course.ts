import { AccessTier } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const courseRouter = createTRPCRouter({
  getCourses: publicProcedure.query(({ ctx }) => {
    return ctx.db.course.findMany({
      include: {
        onchainInstance: true,
      },
    });
  }),

  getCourse: publicProcedure
    .input(
      z.object({
        courseCode: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.course.findFirst({
        where: {
          courseCode: input.courseCode,
        },
        include: {
          contributors: {
            include: {
              user: true,
            },
          },
          variants: true,
          onchainInstance: true,
        },
      });
    }),

  getCourseById: publicProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.course.findFirst({
        where: {
          id: input.courseId,
        },
        include: {
          modules: true,
          contributors: {
            include: {
              user: true,
            },
          },
          variants: true,
        },
      });
    }),

  getCoursesByIds: publicProcedure
    .input(z.object({ courseIds: z.array(z.string()) }))
    .query(({ ctx, input }) => {
      return ctx.db.course.findMany({
        where: {
          id: {
            in: input.courseIds,
          },
        },
      });
    }),

  getCoursesByCourseCodes: publicProcedure
    .input(z.object({ courseCodes: z.array(z.string()) }))
    .query(({ ctx, input }) => {
      return ctx.db.course.findMany({
        where: {
          courseCode: {
            in: input.courseCodes,
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        courseCode: z.string().min(1, "Course code is required"),
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
        videoUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.creatorId) {
        throw new Error("User does not have Creator role.");
      }

      const subscription = await ctx.db.subscription.findUnique({
        where: { userId: ctx.session.user.id },
        include: { product: true },
      });

      const courseCount = await ctx.db.course.count({
        where: { createdById: ctx.session.user.creatorId }
      })

      // Users without subscription can create 1 treasury
      if (!subscription && courseCount >= 1) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Subscribe to create more than one course",
        });
      }


      // Check if subscribed user has reached their treasury limit
      if (subscription && courseCount >= subscription.product.maxAllowedCourses) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Your subscription allows up to ${subscription.product.maxAllowedCourses} courses`,
        });
      }


      return ctx.db.course.create({
        data: {
          courseCode: input.courseCode,
          title: input.title,
          description: input.description,
          category: input.category,
          imageUrl: input.imageUrl,
          videoUrl: input.videoUrl,
          accessTier: "HIDDEN",
          createdBy: { connect: { id: ctx.session.user.creatorId } },
        },
      });
    }),

  getCoursesByOwner: protectedProcedure.query(({ ctx }) => {
    return ctx.db.course.findMany({
      where: {
        OR: [
          { createdBy: { id: ctx.session.user.creatorId } },
          { contributors: { some: { id: ctx.session.user.creatorId } } },
        ],
      },
      include: {
        modules: true,
        contributors: {
          include: {
            user: true,
          },
        },
        variants: true,
        onchainInstance: true,
      },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        courseCode: z.string().min(1, "Course code is required"),
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
        videoUrl: z.string().optional(),
        accessTier: z.nativeEnum(AccessTier).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.course.update({
        where: {
          courseCode: input.courseCode,
        },
        data: {
          title: input.title,
          description: input.description,
          category: input.category,
          imageUrl: input.imageUrl,
          videoUrl: input.videoUrl,
          accessTier: input.accessTier,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "Missing Course ID"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // const assignmentCount = await ctx.db.assignment.count({
      //   where: {
      //     slts: {
      //       some: {
      //         id: input.id,
      //       },
      //     },
      //   },
      // });
      //
      // if (assignmentCount > 0) {
      //   throw new Error(
      //     "Cannot delete this SLT because it is already used in an Assignment",
      //   );
      // }

      return ctx.db.$transaction([
        // ctx.db.lesson.deleteMany({
        //   where: {
        //     sltId: input.id,
        //   },
        // }),
        // ctx.db.slt.deleteMany({
        //   where: {
        //     id: input.id,
        //   },
        // }),
        ctx.db.course.delete({ where: { id: input.id } }),
      ]);
    }),

  addCourseContributor: protectedProcedure
    .input(
      z.object({
        courseCode: z.string().min(1, "Course code is required"),
        creatorId: z.string().min(1, "Creator ID is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.course.update({
        where: {
          courseCode: input.courseCode,
        },
        data: {
          contributors: {
            connect: { userId: input.creatorId },
          },
        },
        include: {
          contributors: true,
        },
      });
    }),

  removeCourseManager: protectedProcedure
    .input(
      z.object({
        courseCode: z.string().min(1, "Course code is required"),
        userId: z.string().min(1, "User ID is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.course.update({
        where: {
          courseCode: input.courseCode,
        },
        data: {
          contributors: {
            disconnect: { id: input.userId },
          },
        },
        include: {
          contributors: true,
        },
      });
    }),
});
