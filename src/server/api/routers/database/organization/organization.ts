import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { OrganizationRole } from "@prisma/client";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

// Input validation schemas
const createOrganizationSchema = z.object({
	name: z.string().min(1, "Organization name is required"),
	description: z.string().optional(),
	imageUrl: z.string().url().optional(),
});

const updateOrganizationSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Organization name is required"),
	description: z.string().optional(),
	imageUrl: z.string().url().optional(),
});

export const organizationRouter = createTRPCRouter({
	// Public procedures - read-only operations
	getAll: publicProcedure.query(({ ctx }) => {
		return ctx.db.organization.findMany({
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
				courses: {
					include: {
						course: true,
					},
				},
				treasuries: {
					include: {
						treasury: true,
					},
				},
			},
		});
	}),

	getById: publicProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			const organization = await ctx.db.organization.findUnique({
				where: { id: input },
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
					courses: {
						include: {
							course: true,
						},
					},
					treasuries: {
						include: {
							treasury: true,
						},
					},
				},
			});

			if (!organization) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Organization not found",
				});
			}

			return organization;
		}),

	// Protected procedures - require authentication
	create: protectedProcedure
		.input(createOrganizationSchema)
		.mutation(async ({ ctx, input }) => {
			return ctx.db.$transaction(async (tx) => {
				// Create the organization
				const organization = await tx.organization.create({
					data: {
						name: input.name,
						description: input.description,
						imageUrl: input.imageUrl,
					},
				});

				// Add the creator as an OWNER member
				await tx.organizationMember.create({
					data: {
						organizationId: organization.id,
						userId: ctx.session.user.id,
						role: OrganizationRole.OWNER,
					},
				});

				return organization;
			});
		}),

	update: protectedProcedure
		.input(updateOrganizationSchema)
		.mutation(async ({ ctx, input }) => {
			// Check if user has permission (OWNER or ADMIN)
			const membership = await ctx.db.organizationMember.findFirst({
				where: {
					organizationId: input.id,
					userId: ctx.session.user.id,
					role: { in: [OrganizationRole.OWNER, OrganizationRole.ADMIN] },
				},
			});

			if (!membership) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You don't have permission to update this organization",
				});
			}

			return ctx.db.organization.update({
				where: { id: input.id },
				data: {
					name: input.name,
					description: input.description,
					imageUrl: input.imageUrl,
				},
			});
		}),

	delete: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input }) => {
			// Check if user is OWNER
			const membership = await ctx.db.organizationMember.findFirst({
				where: {
					organizationId: input,
					userId: ctx.session.user.id,
					role: OrganizationRole.OWNER,
				},
			});

			if (!membership) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Only the owner can delete an organization",
				});
			}

			return ctx.db.$transaction(async (tx) => {
				// Delete all memberships
				await tx.organizationMember.deleteMany({
					where: { organizationId: input },
				});

				// Delete all course relationships
				await tx.organizationCourse.deleteMany({
					where: { organizationId: input },
				});

				// Delete all treasury relationships
				await tx.organizationTreasury.deleteMany({
					where: { organizationId: input },
				});

				// Delete the organization
				return tx.organization.delete({
					where: { id: input },
				});
			});
		}),

	// User-specific queries
	getUserOrganizations: protectedProcedure.query(({ ctx }) => {
		return ctx.db.organizationMember.findMany({
			where: {
				userId: ctx.session.user.id,
			},
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
						courses: {
							include: {
								course: true,
							},
						},
						treasuries: {
							include: {
								treasury: true,
							},
						},
					},
				},
			},
		});
	}),

	getOwnedOrganizations: protectedProcedure.query(({ ctx }) => {
		return ctx.db.organizationMember.findMany({
			where: {
				userId: ctx.session.user.id,
				role: OrganizationRole.OWNER,
			},
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
