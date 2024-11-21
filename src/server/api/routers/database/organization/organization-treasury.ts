import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { OrganizationRole } from "@prisma/client";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

// Input validation schemas
const addTreasurySchema = z.object({
	organizationId: z.string(),
	treasuryId: z.string(),
});


export const organizationTreasuryRouter = createTRPCRouter({
	// Public procedures
	getTreasuries: publicProcedure
		.input(z.string())
		.query(({ ctx, input: organizationId }) => {
			return ctx.db.organizationTreasury.findMany({
				where: { organizationId },
				include: {
					treasury: {
						include: {
							escrows: {
								include: {
									tasks: true,
								},
							},
						},
					},
				},
				orderBy: { createdAt: "desc" },
			});
		}),

	// Protected procedures
	addTreasury: protectedProcedure
		.input(addTreasurySchema)
		.mutation(async ({ ctx, input }) => {
			// Check if user has permission to manage treasuries
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
					message: "You don't have permission to add treasuries",
				});
			}

			// Check if treasury exists
			const treasury = await ctx.db.treasury.findUnique({
				where: { id: input.treasuryId },
			});

			if (!treasury) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Treasury not found",
				});
			}

			// Check if treasury is already in organization
			const existingRelation = await ctx.db.organizationTreasury.findUnique({
				where: {
					organizationId_treasuryId: {
						organizationId: input.organizationId,
						treasuryId: input.treasuryId,
					},
				},
			});

			if (existingRelation) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Treasury is already in this organization",
				});
			}

			return ctx.db.organizationTreasury.create({
				data: {
					organizationId: input.organizationId,
					treasuryId: input.treasuryId,
				},
				include: {
					treasury: {
						include: {
							escrows: {
								include: {
									tasks: true,
								},
							},
						},
					},
				},
			});
		}),

	removeTreasury: protectedProcedure
		.input(addTreasurySchema)
		.mutation(async ({ ctx, input }) => {
			// Check if user has permission to manage treasuries
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
					message: "You don't have permission to remove treasuries",
				});
			}

			// Check if the relationship exists
			const existingRelation = await ctx.db.organizationTreasury.findUnique({
				where: {
					organizationId_treasuryId: {
						organizationId: input.organizationId,
						treasuryId: input.treasuryId,
					},
				},
			});

			if (!existingRelation) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Treasury is not in this organization",
				});
			}

			return ctx.db.organizationTreasury.delete({
				where: {
					organizationId_treasuryId: {
						organizationId: input.organizationId,
						treasuryId: input.treasuryId,
					},
				},
			});
		}),

	// Bulk operations for treasuries
	addMultipleTreasuries: protectedProcedure
		.input(
			z.object({
				organizationId: z.string(),
				treasuryIds: z.array(z.string()),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Check if user has permission to manage treasuries
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
					message: "You don't have permission to add treasuries",
				});
			}

			// Verify all treasuries exist
			const treasuries = await ctx.db.treasury.findMany({
				where: {
					treasuryNftPolicyId: {
						in: input.treasuryIds,
					},
				},
			});

			if (treasuries.length !== input.treasuryIds.length) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "One or more treasuries not found",
				});
			}

			// Get existing relations to avoid duplicates
			const existingRelations = await ctx.db.organizationTreasury.findMany({
				where: {
					organizationId: input.organizationId,
					treasuryId: {
						in: input.treasuryIds,
					},
				},
			});

			// Filter out treasuries that are already in the organization
			const existingTreasuryIds = new Set(
				existingRelations.map((relation) => relation.treasuryId),
			);
			const newTreasuryIds = input.treasuryIds.filter(
				(id) => !existingTreasuryIds.has(id),
			);

			if (newTreasuryIds.length === 0) {
				return [];
			}

			// Create new relations
			return ctx.db.organizationTreasury.createMany({
				data: newTreasuryIds.map((treasuryId) => ({
					organizationId: input.organizationId,
					treasuryId,
				})),
			});
		}),

	removeMultipleTreasuries: protectedProcedure
		.input(
			z.object({
				organizationId: z.string(),
				treasuryNftPolicyIds: z.array(z.string()),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Check if user has permission to manage treasuries
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
					message: "You don't have permission to remove treasuries",
				});
			}

			return ctx.db.organizationTreasury.deleteMany({
				where: {
					organizationId: input.organizationId,
					treasuryId: {
						in: input.treasuryNftPolicyIds,
					},
				},
			});
		}),

	// Additional queries
	getOrganizationsForTreasury: publicProcedure
		.input(z.string())
		.query(({ ctx, input: treasuryId }) => {
			return ctx.db.organizationTreasury.findMany({
				where: { treasuryId },
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

	// Summary data
	getTreasurySummary: publicProcedure
		.input(
			z.object({
				organizationId: z.string(),
				treasuryNftPolicyId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const treasury = await ctx.db.treasury.findUnique({
				where: { treasuryNftPolicyId: input.treasuryNftPolicyId },
				include: {
					escrows: {
						include: {
							tasks: true,
						},
					},
				},
			});

			if (!treasury) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Treasury not found",
				});
			}

			// Calculate summary statistics
			const totalEscrows = treasury.escrows.length;
			const totalTasks = treasury.escrows.reduce(
				(sum, escrow) => sum + escrow.tasks.length,
				0,
			);
			const totalLovelace = treasury.escrows.reduce(
				(sum, escrow) =>
					sum +
					escrow.tasks.reduce(
						(escrowSum, task) => escrowSum + BigInt(task.lovelace),
						BigInt(0),
					),
				BigInt(0),
			);

			return {
				totalEscrows,
				totalTasks,
				totalLovelace: totalLovelace.toString(),
				totalAda: Number(totalLovelace) / 1_000_000, // Convert lovelace to ADA
			};
		}),
});
