import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { OrganizationRole } from "@prisma/client";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

// Input validation schemas
const addCourseSchema = z.object({
	organizationId: z.string(),
	courseId: z.string(),
});


export const organizationCourseRouter = createTRPCRouter({
	// Public procedures
	getCourses: publicProcedure
		.input(z.string())
		.query(({ ctx, input: organizationId }) => {
			return ctx.db.organizationCourse.findMany({
				where: { organizationId },
				include: {
					course: {
						include: {
							modules: true,
							onchainInstance: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
			});
		}),

	// Protected procedures
	addCourse: protectedProcedure
		.input(addCourseSchema)
		.mutation(async ({ ctx, input }) => {
			// Check if user has permission to manage courses
			const hasPermission = await ctx.db.organizationMember.findFirst({
				where: {
					organizationId: input.organizationId,
					userId: ctx.session.user.id,
					role: { in: [OrganizationRole.OWNER, OrganizationRole.ADMIN] },
				},
			});

			if (!hasPermission) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You don't have permission to add members",
				});
			}

			// Check if course exists
			const course = await ctx.db.course.findUnique({
				where: { id: input.courseId },
			});

			if (!course) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Course not found",
				});
			}

			// Check if course is already in organization
			const existingRelation = await ctx.db.organizationCourse.findUnique({
				where: {
					organizationId_courseId: {
						organizationId: input.organizationId,
						courseId: input.courseId,
					},
				},
			});

			if (existingRelation) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Course is already in this organization",
				});
			}

			return ctx.db.organizationCourse.create({
				data: {
					organizationId: input.organizationId,
					courseId: input.courseId,
				},
				include: {
					course: {
						include: {
							modules: true,
							onchainInstance: true,
						},
					},
				},
			});
		}),

	removeCourse: protectedProcedure
		.input(addCourseSchema)
		.mutation(async ({ ctx, input }) => {
			// Check if user has permission to manage courses
			const hasPermission = await ctx.db.organizationMember.findFirst({
				where: {
					organizationId: input.organizationId,
					userId: ctx.session.user.id,
					role: { in: [OrganizationRole.OWNER, OrganizationRole.ADMIN] },
				},
			});
			if (!hasPermission) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You don't have permission to remove courses",
				});
			}

			// Check if the relationship exists
			const existingRelation = await ctx.db.organizationCourse.findUnique({
				where: {
					organizationId_courseId: {
						organizationId: input.organizationId,
						courseId: input.courseId,
					},
				},
			});

			if (!existingRelation) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Course is not in this organization",
				});
			}

			return ctx.db.organizationCourse.delete({
				where: {
					organizationId_courseId: {
						organizationId: input.organizationId,
						courseId: input.courseId,
					},
				},
			});
		}),

	// Bulk operations for courses
	addMultipleCourses: protectedProcedure
		.input(
			z.object({
				organizationId: z.string(),
				courseIds: z.array(z.string()),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Check if user has permission to manage courses
			const hasPermission = await ctx.db.organizationMember.findFirst({
				where: {
					organizationId: input.organizationId,
					userId: ctx.session.user.id,
					role: { in: [OrganizationRole.OWNER, OrganizationRole.ADMIN] },
				},
			});
			if (!hasPermission) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You don't have permission to add courses",
				});
			}

			// Verify all courses exist
			const courses = await ctx.db.course.findMany({
				where: {
					id: {
						in: input.courseIds,
					},
				},
			});

			if (courses.length !== input.courseIds.length) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "One or more courses not found",
				});
			}

			// Get existing relations to avoid duplicates
			const existingRelations = await ctx.db.organizationCourse.findMany({
				where: {
					organizationId: input.organizationId,
					courseId: {
						in: input.courseIds,
					},
				},
			});

			// Filter out courses that are already in the organization
			const existingCourseIds = new Set(
				existingRelations.map((relation) => relation.courseId),
			);
			const newCourseIds = input.courseIds.filter(
				(id) => !existingCourseIds.has(id),
			);

			if (newCourseIds.length === 0) {
				return [];
			}

			// Create new relations
			return ctx.db.organizationCourse.createMany({
				data: newCourseIds.map((courseId) => ({
					organizationId: input.organizationId,
					courseId,
				})),
			});
		}),

	removeMultipleCourses: protectedProcedure
		.input(
			z.object({
				organizationId: z.string(),
				courseIds: z.array(z.string()),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Check if user has permission to manage courses
			const hasPermission = await ctx.db.organizationMember.findFirst({
				where: {
					organizationId: input.organizationId,
					userId: ctx.session.user.id,
					role: { in: [OrganizationRole.OWNER, OrganizationRole.ADMIN] },
				},
			});

			if (!hasPermission) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You don't have permission to remove courses",
				});
			}

			return ctx.db.organizationCourse.deleteMany({
				where: {
					organizationId: input.organizationId,
					courseId: {
						in: input.courseIds,
					},
				},
			});
		}),

	// Additional queries
	getOrganizationsForCourse: publicProcedure
		.input(z.string())
		.query(({ ctx, input: courseId }) => {
			return ctx.db.organizationCourse.findMany({
				where: { courseId },
				include: {
					organization: {
						include: {
							members: {
								include: {
									user: {
										select: {
											id: true,
											name: true,
											email: true,
											image: true,
										},
									},
								},
							},
						},
					},
				},
			});
		}),
});
