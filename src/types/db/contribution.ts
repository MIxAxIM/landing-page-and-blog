import { PrerequisiteStatus, type TaskStatus } from "@prisma/client";
import { type RouterOutputs } from "~/utils/api";

export type TreasuryOwner = RouterOutputs["treasuryOwner"]["getTreasuryOwnerByUser"]

// Contribution Features
export type Treasury = RouterOutputs["treasury"]["getTreasuryById"] & {
  _count?: {
    escrows: number;
  };
  escrow?: { id: string };
  totalAda?: number;
  totalTasks?: number;
};

export type TreasuryAmountsByStatus = RouterOutputs["treasury"]["getTreasuryAmountsByStatus"];

export type Escrow = RouterOutputs["escrow"]["getEscrowById"] & {
  treasury?: Treasury;
  tasks?: Task[];
  contributorPrerequisites?: ContributorPrerequisite[];
  totalAda?: number;
};

export type Task = {
  id: string;
  index: number;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  status: TaskStatus;
  taskHash: string | null;
  hash: string | null;
  lovelace: string;
  expirationTime: string;
  escrowId: string;
  numAllowedCommitments: number;
  escrow?: {
    id: string;
    title: string | null;
    escrowNftPolicyId: string | null;
    treasuryId: string;
    isSyncedWithNetwork: boolean;
    savedAcceptanceCriteria: string[];
    contributorPrerequisites?: {
      contributorPolicyId: string;
      title: string | null;
    }[];
  };
  isEditable?: boolean;
};

export type TaskCommitment = RouterOutputs["taskCommitment"]["getTaskCommitmentById"]


// TODO: Need course policyId to sent to Project APIs

export type CourseRequirement = {
  id: string;
  prerequisiteId: string;
  courseCode: string;
  requiredModules: string[];
  course?: {
    id: string;
    courseCode: string;
    title: string;
    courseCreatorNFTPolicyID: string;
  };
};

export type ContributorPrerequisite = {
  id: string;
  contributorPolicyId?: string;
  title?: string | null;
  status: PrerequisiteStatus;
  courseRequirements: CourseRequirement[];
  escrows?: Escrow[];
};


export type ProjectDatum = {
  project_hash: string;
  escrow_hash: string;
  commitment_allowed: number;
  allowed_contributors: string[];
}

type Funds = {
  unit: string;
  amount: number;
}

export type TreasuryInfo = {
  funds: Funds[]
  projects: ProjectDatum[]
}
