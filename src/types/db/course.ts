import { AssignmentNetworkStatus, AssignmentPrivateStatus, AssignmentStatus, Prisma } from "@prisma/client";
import { type RouterOutputs } from "~/utils/api";

// Course types
export type Course = RouterOutputs["course"]["getCourse"];
export type CoursePublic = RouterOutputs["course"]["getCourses"][number];
export type CourseModuleOverview =
  RouterOutputs["module"]["getCourseModuleOverviews"][number];
export type CourseModuleWithAssignmentSummary =
  RouterOutputs["module"]["getCourseModuleWithAssignmentSummary"][number];
export type Creator = RouterOutputs["creator"]["getCreatorByUser"];
export type Learner = RouterOutputs["learner"]["getLearnerByUser"];
export type LearnerSavedCourse =
  RouterOutputs["learner"]["getSavedCoursesByLearner"][number];
export type CourseVariant =
  RouterOutputs["courseVariant"]["getCourseVariants"][number];
export type ModuleVariant =
  RouterOutputs["moduleVariant"]["getCourseModuleVariants"][number];
export type ModuleSLT = RouterOutputs["slt"]["getModuleSLTs"][number];
export type Lesson = RouterOutputs["lesson"]["getModuleLessons"][number];
export type Assignment = RouterOutputs["assignment"]["getAssignmentByModuleId"];
export type Introduction = RouterOutputs["introduction"]["getIntroduction"];
export type AssignmentCommitment = {
  id: string;
  assignmentId: string;
  learnerId: string;
  privateStatus: AssignmentPrivateStatus;
  privateEvidence?: Prisma.JsonValue | null;
  networkStatus: AssignmentNetworkStatus;
  networkEvidence?: Prisma.JsonValue | null;
  networkEvidenceHash?: string | null;
  favorite: boolean;
  archived: boolean;
  // deprecated
  learnerNotes?: string | null;
  privateNotes?: string | null;
  status: AssignmentStatus;
  assignment: {
    title: string
  };
  // end deprecated
};
