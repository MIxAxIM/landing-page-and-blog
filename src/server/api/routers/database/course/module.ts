import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const moduleRouter = createTRPCRouter({
  getModule: publicProcedure
    .input(z.object({ moduleId: z.string() }))
    .query(async ({ ctx, input }) => {
      const courseModule = ctx.db.module.findFirst({
        where: {
          id: input.moduleId,
        },
        include: {
          originalCourse: {
            select: {
              courseCode: true,
            },
          },
          slts: {
            select: {
              id: true,
              moduleIndex: true,
              moduleId: true,
              sltText: true,
              assignments: true,
              createdById: true,
            },
          },
          lessons: {
            select: {
              id: true,
              title: true,
              live: true,
              sltId: true,
            },
          },
          assignments: true,
          introduction: true,
        },
      });

      if (!courseModule) {
        throw new Error("Course Module not found");
      }

      // Check if all content in the module is published
      const isPublished = await ctx.db.$transaction([
        ctx.db.lesson.count({
          where: { moduleId: input.moduleId, live: false },
        }),
        ctx.db.introduction.count({
          where: { moduleId: input.moduleId, live: false },
        }),
        ctx.db.assignment.count({
          where: { moduleId: input.moduleId, live: false },
        }),
      ]);

      const isAllContentPublished = isPublished.every((count) => count === 0);

      return {
        ...module,
        isAllContentPublished,
      };
    }),

  getCourseModuleOverviews: publicProcedure
    .input(z.object({ courseCode: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.module.findMany({
        where: {
          originalCourse: {
            courseCode: input.courseCode,
          },
        },
        include: {
          originalCourse: {
            select: {
              courseCode: true,
            },
          },
          slts: {
            select: {
              id: true,
              moduleIndex: true,
              moduleId: true,
              sltText: true,
              createdById: true,
            },
          },
          lessons: {
            select: {
              id: true,
              title: true,
              live: true,
              sltId: true,
            },
          },
          assignments: {
            select: {
              id: true,
              title: true,
              assignmentCode: true,
              live: true,
            },
          },
          introduction: {
            select: {
              id: true,
              live: true,
            },
          },
        },
      });
    }),

  getCourseModuleWithAssignmentSummary: publicProcedure
    .input(z.object({ courseCode: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.module.findMany({
        where: {
          originalCourse: {
            courseCode: input.courseCode,
          },
        },
        include: {
          originalCourse: {
            select: {
              courseCode: true,
            },
          },
          assignments: {
            select: {
              id: true,
              title: true,
              assignmentCode: true,
              live: true,
            },
          },
        },
      });
    }),

  getCourseModuleList: publicProcedure
    .input(
      z.object({
        courseCodes: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const modules = await ctx.db.module.findMany({
        where: {
          originalCourse: {
            courseCode: {
              in: input.courseCodes,
            },
          },
        },
        select: {
          moduleCode: true,
          title: true,
          originalCourse: {
            select: {
              courseCode: true,
            },
          },
        },
      });

      // Group modules by courseCode
      return input.courseCodes.reduce<
        Record<string, { moduleCode: string; title: string }[]>
      >((acc, courseCode) => {
        acc[courseCode] = modules
          .filter((m) => m.originalCourse.courseCode === courseCode)
          .map(({ moduleCode, title }) => ({ moduleCode, title }));
        return acc;
      }, {});
    }),

  create: protectedProcedure
    .input(
      z.object({
        courseId: z.string().min(1),
        moduleCode: z.string().min(1),
        title: z.string().min(1),
        description: z.string().optional(),
        releaseDate: z.coerce.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.creatorId) {
        throw new Error("User does not have Creator role.");
      }

      return ctx.db.module.create({
        data: {
          moduleCode: input.moduleCode,
          title: input.title,
          description: input.description,
          releaseDate: input.releaseDate,
          originalCourse: {
            connect: {
              id: input.courseId,
            },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        moduleId: z.string().min(1, "Module ID is required"),
        courseCode: z.string().min(1, "Course code is required"),
        moduleCode: z.string().min(1, "Module code is required"),
        title: z.string().min(1, "Title is required"),
        description: z.string(),
        releaseDate: z.coerce.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.module.update({
        where: {
          id: input.moduleId,
        },
        data: {
          title: input.title,
          description: input.description,
          moduleCode: input.moduleCode,
          releaseDate: input.releaseDate,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        moduleId: z.string().min(1, "Module ID is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction([
        ctx.db.introduction.deleteMany({ where: { moduleId: input.moduleId } }),
        ctx.db.assignment.deleteMany({ where: { moduleId: input.moduleId } }),
        ctx.db.module.delete({
          where: {
            id: input.moduleId,
          },
        }),
      ]);
    }),

  publishModuleContent: protectedProcedure
    .input(
      z.object({
        moduleId: z.string().min(1, "Module ID is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction([
        ctx.db.lesson.updateMany({
          where: { moduleId: input.moduleId },
          data: { live: true },
        }),
        ctx.db.introduction.updateMany({
          where: { moduleId: input.moduleId },
          data: { live: true },
        }),
        ctx.db.assignment.updateMany({
          where: { moduleId: input.moduleId },
          data: { live: true },
        }),
      ]);
    }),

  checkIfModuleIsPublished: protectedProcedure
    .input(
      z.object({
        moduleId: z.string().min(1, "Module ID is required"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [
        unpublishedLessons,
        unpublishedIntroductions,
        unpublishedAssignments,
      ] = await ctx.db.$transaction([
        ctx.db.lesson.count({
          where: { moduleId: input.moduleId, live: false },
        }),
        ctx.db.introduction.count({
          where: { moduleId: input.moduleId, live: false },
        }),
        ctx.db.assignment.count({
          where: { moduleId: input.moduleId, live: false },
        }),
      ]);

      // If no unpublished content is found, the module is fully published
      return (
        unpublishedLessons === 0 &&
        unpublishedIntroductions === 0 &&
        unpublishedAssignments === 0
      );
    }),

  copyModuleToCourse: protectedProcedure
    .input(
      z.object({
        originalCourseModuleId: z.string().min(1),
        targetCourseId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const creatorId = ctx.session.user.creatorId;

      const sourceModule = await ctx.db.module.findFirst({
        where: {
          id: input.originalCourseModuleId,
          originalCourse: {
            OR: [
              { createdById: creatorId }, // after this is working, extend to any contributor
              { contributors: { some: { id: creatorId } } },
            ],
          },
        },
        include: {
          slts: {
            include: {
              lesson: true,
            },
          },
          introduction: true,
          assignments: true,
        },
      });

      if (!sourceModule) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cannot find this module in the courses you own.",
        });
      }

      const targetCourse = await ctx.db.course.findFirst({
        where: {
          id: input.targetCourseId,
          createdById: creatorId, // after this is working, extend to any contributor
        },
      });

      if (!targetCourse) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You do not have permission to copy a module to this course.",
        });
      }

      const newCourseModule = await ctx.db.module.create({
        data: {
          moduleCode: sourceModule.moduleCode + "-c",
          title: sourceModule.title + " (copy)",
          description: sourceModule.description,
          courseId: targetCourse.id,
        },
      });

      // Copy SLTs
      for (const slt of sourceModule.slts) {
        const newSlt = await ctx.db.slt.create({
          data: {
            moduleId: newCourseModule.id,
            moduleIndex: slt.moduleIndex,
            sltText: slt.sltText,
            createdById: slt.createdById,
          },
        });

        if (slt.lesson) {
          await ctx.db.lesson.create({
            data: {
              module: { connect: { id: newCourseModule.id } },
              slt: { connect: { id: newSlt.id } },
              title: slt.lesson.title + " (Copy)",
              description: slt.lesson.description,
              contentJson: slt.lesson.contentJson ?? {},
              imageUrl: slt.lesson.imageUrl,
              videoUrl: slt.lesson.videoUrl,
              live: false,
              createdBy: { connect: { id: slt.lesson.createdById } },
            },
          });
        }
      }

      // Copy Assignments (those directly related to the module)
      for (const assignment of sourceModule.assignments) {
        await ctx.db.assignment.create({
          data: {
            moduleId: newCourseModule.id,
            assignmentCode: assignment.assignmentCode + "_copy",
            title: assignment.title + " (Copy)",
            description: assignment.description,
            contentJson: assignment.contentJson ?? {},
            imageUrl: assignment.imageUrl,
            videoUrl: assignment.videoUrl,
            live: assignment.live,
            createdById: assignment.createdById,
          },
        });
      }

      if (!!sourceModule.introduction) {
        await ctx.db.introduction.create({
          data: {
            moduleId: newCourseModule.id,
            title: sourceModule.introduction.title + " (Copy)",
            description: sourceModule.introduction.description,
            contentJson: sourceModule.introduction.contentJson ?? {},
            imageUrl: sourceModule.introduction.imageUrl,
            videoUrl: sourceModule.introduction.videoUrl,
            live: sourceModule.introduction.live,
          },
        });
      }

      return newCourseModule;
    }),
});
