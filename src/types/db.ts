import { type RouterOutputs } from "~/utils/api";

export type Course = RouterOutputs["course"]["getCourse"];
export type CoursePublic = RouterOutputs["course"]["getCourses"][number];
export type CourseModuleOverview =
  RouterOutputs["module"]["getCourseModuleOverviews"][number];
export type CourseModuleWithAssignmentSummary =
  RouterOutputs["module"]["getCourseModuleWithAssignmentSummary"][number];
export type User = RouterOutputs["user"]["getUserByName"][number];
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
export type Treasury = RouterOutputs["treasury"]["getTreasuryById"];
export type Escrow = RouterOutputs["escrow"]["getEscrowById"];
export type Task = RouterOutputs["task"]["getTaskById"];
