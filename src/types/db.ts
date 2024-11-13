import { type TaskStatus } from "@prisma/client";
import { type RouterOutputs } from "~/utils/api";

// Stripe payment types
export type Subscription = RouterOutputs["billing"]["getCurrentSubscription"]

// Course types
export type Course = RouterOutputs["course"]["getCourse"];
export type CoursePublic = RouterOutputs["course"]["getCourses"][number];
export type CourseModuleOverview =
  RouterOutputs["module"]["getCourseModuleOverviews"][number];
export type CourseModuleWithAssignmentSummary =
  RouterOutputs["module"]["getCourseModuleWithAssignmentSummary"][number];
export type User = RouterOutputs["user"]["getUserByName"][number] & {
  isAdmin: boolean;
};
export type Creator = RouterOutputs["creator"]["getCreatorByUser"];
export type Learner = RouterOutputs["learner"]["getLearnerByUser"];
export type LearnerSavedCourse =
  RouterOutputs["learner"]["getSavedCoursesByLearner"][number];
export type CourseVariant =
  RouterOutputs["courseVariant"]["getCourseVariants"][number];
export type ModuleVariant =
  RouterOutputs["moduleVariant"]["getCourseModuleVariants"][number];
export type CourseOnChainInstance =
  RouterOutputs["courseOnChainInstance"]["getCourseOnchainInstances"];
export type ModuleSLT = RouterOutputs["slt"]["getModuleSLTs"][number];
export type Lesson = RouterOutputs["lesson"]["getModuleLessons"][number];
export type Assignment = RouterOutputs["assignment"]["getAssignmentByModuleId"];
export type Introduction = RouterOutputs["introduction"]["getIntroduction"];
export type AssignmentCommitment = {
  assignmentId: string;
  assignmentCommitmentId: string;
  learnerNotes: string;
  status: "SAVE_FOR_LATER" | "IN_PROGRESS" | "COMPLETE" | "COMMITMENT";
  archived: boolean;
};

// Contribution Features
export type Treasury = RouterOutputs["treasury"]["getTreasuryById"] & {
  _count?: {
    escrows: number;
  };
  totalAda?: number;
  totalTasks?: number;
};

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
  hash: string | null;
  lovelace: string;
  expirationTime: string;
  escrowId: string;
  escrow?: {
    id: string;
    title: string | null;
    escrowNftPolicyId: string;
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

export type CourseRequirement = {
  id: string;
  prerequisiteId: string;
  courseCode: string;
  requiredModules: string[];
  course?: {
    id: string;
    courseCode: string;
    title: string;
  };
};

export type ContributorPrerequisite = {
  id: string;
  contributorPolicyId: string;
  title?: string | null;
  courseRequirements: CourseRequirement[];
  escrows?: Escrow[];
};
