import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { OrganizationRole } from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// Input validation schemas
const addMemberSchema = z.object({
  organizationId: z.string(),
  userId: z.string(),
  role: z.nativeEnum(OrganizationRole).default(OrganizationRole.MEMBER),
});

const updateMemberRoleSchema = z.object({
  organizationId: z.string(),
  userId: z.string(),
  role: z.nativeEnum(OrganizationRole),
});


export const organizationMemberRouter = createTRPCRouter({
  // Public procedures - read-only operations
  getMembers: publicProcedure
    .input(z.string())
    .query(({ ctx, input: organizationId }) => {
      return ctx.db.organizationMember.findMany({
        where: { organizationId },
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
        orderBy: [
          { role: "asc" },
          { joinedAt: "desc" },
        ],
      });
    }),

  getMemberOrganizations: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const memberOrgs = await ctx.db.organizationMember.findMany({
        where: { userId: input.userId },
        include: {
          organization: {
            include: {
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

      return memberOrgs.map((member) => ({
        ...member.organization,
        role: member.role,
      }));
    }),

  // Protected procedures
  addMember: protectedProcedure
    .input(addMemberSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user has permission to add members
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

      // Check if user is already a member
      const existingMember = await ctx.db.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId: input.organizationId,
            userId: input.userId,
          },
        },
      });

      if (existingMember) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is already a member of this organization",
        });
      }

      // Only OWNER can add other OWNERS
      if (
        input.role === OrganizationRole.OWNER &&
        !(await ctx.db.organizationMember.findFirst({
          where: {
            organizationId: input.organizationId,
            userId: ctx.session.user.id,
            role: OrganizationRole.OWNER,
          },
        })
        )) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only owners can add other owners",
        });
      }

      return ctx.db.organizationMember.create({
        data: {
          organizationId: input.organizationId,
          userId: input.userId,
          role: input.role,
          invitedBy: ctx.session.user.id,
        },
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
      });
    }),

  updateMemberRole: protectedProcedure
    .input(updateMemberRoleSchema)
    .mutation(async ({ ctx, input }) => {
      // Get current user's role
      const currentUserRole = await ctx.db.organizationMember.findFirst({
        where: {
          organizationId: input.organizationId,
          userId: ctx.session.user.id,
        },
        select: { role: true },
      });

      if (!currentUserRole) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of this organization",
        });
      }

      // Get target member's current role
      const targetMember = await ctx.db.organizationMember.findFirst({
        where: {
          organizationId: input.organizationId,
          userId: input.userId,
        },
      });

      if (!targetMember) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Member not found",
        });
      }

      // Role change validation rules
      if (currentUserRole.role !== OrganizationRole.OWNER) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only owners can change member roles",
        });
      }

      // Prevent changing the role of the last OWNER
      if (
        targetMember.role === OrganizationRole.OWNER &&
        input.role !== OrganizationRole.OWNER
      ) {
        const ownerCount = await ctx.db.organizationMember.count({
          where: {
            organizationId: input.organizationId,
            role: OrganizationRole.OWNER,
          },
        });

        if (ownerCount <= 1) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot remove the last owner",
          });
        }
      }

      return ctx.db.organizationMember.update({
        where: {
          organizationId_userId: {
            organizationId: input.organizationId,
            userId: input.userId,
          },
        },
        data: {
          role: input.role,
        },
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
      });
    }),

  removeMember: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has permission to remove members
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
          message: "You don't have permission to remove members",
        });
      }

      // Get target member's role
      const targetMember = await ctx.db.organizationMember.findFirst({
        where: {
          organizationId: input.organizationId,
          userId: input.userId,
        },
      });

      if (!targetMember) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Member not found",
        });
      }


      if (
        targetMember.role === OrganizationRole.OWNER &&
        !(await ctx.db.organizationMember.findFirst({
          where: {
            organizationId: input.organizationId,
            userId: ctx.session.user.id,
            role: OrganizationRole.OWNER,
          },
        })
        )) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only owners can add other owners",
        });
      }

      // Prevent removing the last OWNER
      if (targetMember.role === OrganizationRole.OWNER) {
        const ownerCount = await ctx.db.organizationMember.count({
          where: {
            organizationId: input.organizationId,
            role: OrganizationRole.OWNER,
          },
        });

        if (ownerCount <= 1) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot remove the last owner",
          });
        }
      }

      return ctx.db.organizationMember.delete({
        where: {
          organizationId_userId: {
            organizationId: input.organizationId,
            userId: input.userId,
          },
        },
      });
    }),

  // User can leave organization
  leaveOrganization: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: organizationId }) => {
      const membership = await ctx.db.organizationMember.findFirst({
        where: {
          organizationId,
          userId: ctx.session.user.id,
        },
      });

      if (!membership) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You are not a member of this organization",
        });
      }

      // Prevent the last OWNER from leaving
      if (membership.role === OrganizationRole.OWNER) {
        const ownerCount = await ctx.db.organizationMember.count({
          where: {
            organizationId,
            role: OrganizationRole.OWNER,
          },
        });

        if (ownerCount <= 1) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "The last owner cannot leave the organization",
          });
        }
      }

      return ctx.db.organizationMember.delete({
        where: {
          organizationId_userId: {
            organizationId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
});
