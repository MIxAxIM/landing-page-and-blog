
import { OrganizationRole } from "@prisma/client";
import { type RouterOutputs } from "~/utils/api";


export type Organization = RouterOutputs["organization"]["getAll"][number]
export type OrganizationMember = RouterOutputs["organizationMember"]["getMembers"][number]
export type OrganizationTreasury = RouterOutputs["organizationTreasury"]["getTreasuries"][number]
export type OrganizationCourse = RouterOutputs["organizationCourse"]["getCourses"][number]


// Enhanced types with nested data
export type OrganizationWithRelations = Organization & {
  members: OrganizationMember[];
  courses: OrganizationCourse[];
  treasuries: OrganizationTreasury[];
};

// Useful subset types
export type OrganizationMemberWithUser = OrganizationMember & {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

export type TreasurySummary = RouterOutputs["organizationTreasury"]["getTreasurySummary"] & {
  totalEscrows: number;
  totalTasks: number;
  totalLovelace: string;
  totalAda: number;
};

// Type guards and helper types
export type OrganizationRoleLevel = {
  [K in OrganizationRole]: number;
};

export const ROLE_LEVELS: OrganizationRoleLevel = {
  OWNER: 4,
  ADMIN: 3,
  MEMBER: 2,
  GUEST: 1,
};

// Helper functions with type safety
export const canManageMembers = (memberRole: OrganizationRole): boolean => {
  return ROLE_LEVELS[memberRole] >= ROLE_LEVELS.ADMIN;
};

export const canManageOrganization = (memberRole: OrganizationRole): boolean => {
  return ROLE_LEVELS[memberRole] >= ROLE_LEVELS.ADMIN;
};

export const isOwner = (memberRole: OrganizationRole): boolean => {
  return memberRole === "OWNER";
};
