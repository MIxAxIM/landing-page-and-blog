import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/database/user/user";
import { userWalletRouter } from "./routers/database/user/user-wallet";

// stripe routers
import { billingRouter } from "./routers/stripe/billing";
import { adminRouter } from "./routers/stripe/admin";

import { courseRouter } from "./routers/database/course/course";
import { moduleRouter } from "./routers/database/course/module";
import { courseVariantRouter } from "./routers/database/course/course-variant";
import { moduleVariantRouter } from "./routers/database/course/module-variant";
import { courseOnChainInstanceRouter } from "./routers/database/course/course-onChainInstance";
import { sltRouter } from "./routers/database/course/slt";
import { lessonRouter } from "./routers/database/course/lesson";
import { assignmentRouter } from "./routers/database/course/assignment";
import { creatorRouter } from "./routers/database/course/creator";
import { learnerRouter } from "./routers/database/course/learner";
import { introductionRouter } from "./routers/database/course/introduction";
import { assignmentStatusRouter } from "./routers/database/course/assignment-status";
import { assignmentValidatorRouter } from "./routers/contracts/course/assignment-validator";
import { localStateValidatorRouter } from "./routers/contracts/course/local-state-validator";
import { globalStateValidatorRouter } from "./routers/contracts/course/global-state-validator";
import { courseGovernanceValidatorRouter } from "./routers/contracts/course/course-governance-validator";

import { clientDomainsRouter } from "./routers/premium/clients-domain";

import { studentTxRouter } from "./routers/transactions/student-tx-router";
import { accessTokenTxRouter } from "./routers/transactions/access-token-router";
import { andamioAdminTxRouter } from "./routers/transactions/andamio-admin-tx-router";
import { treasuryRouter } from "./routers/database/contributor/treasury";
import { escrowRouter } from "./routers/database/contributor/escrow";
import { taskRouter } from "./routers/database/contributor/task";
import { contributorPrerequisiteRouter } from "./routers/database/contributor/contributor-prerequisite";
import { contributorRouter } from "./routers/database/contributor/contributor";
import { treasuryOwnerRouter } from "./routers/database/contributor/treasuryOwner";
import { contributionManagerRouter } from "./routers/database/contributor/contribution-manager";

import { projectGeneralRouter } from "./routers/contracts/project/general";
import { organizationRouter } from "./routers/database/organization/organization";
import { organizationMemberRouter } from "./routers/database/organization/member";
import { organizationTreasuryRouter } from "./routers/database/organization/organization-treasury";
import { organizationCourseRouter } from "./routers/database/organization/organization-course";
import { courseCreatorTxRouter } from "./routers/transactions/course-creator-tx-router";
import { projectManagerTxRouter } from "./routers/transactions/project-manager-tx-router";
import { contributorTxRouter } from "./routers/transactions/contributor-tx-router";
import { projectValidatorsRouter } from "./routers/contracts/project/project";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  userWallet: userWalletRouter,

  organization: organizationRouter,
  organizationMember: organizationMemberRouter,
  organizationTreasury: organizationTreasuryRouter,
  organizationCourse: organizationCourseRouter,

  billing: billingRouter,
  admin: adminRouter,

  creator: creatorRouter,
  learner: learnerRouter,
  contributor: contributorRouter,
  treasuryOwner: treasuryOwnerRouter,
  contributionManager: contributionManagerRouter,

  // course off-chain
  course: courseRouter,
  module: moduleRouter,
  courseVariant: courseVariantRouter,
  moduleVariant: moduleVariantRouter,
  courseOnChainInstance: courseOnChainInstanceRouter,
  slt: sltRouter,
  lesson: lessonRouter,
  assignment: assignmentRouter,
  introduction: introductionRouter,

  // course on-chain
  assignmentStatus: assignmentStatusRouter,
  assignmentValidator: assignmentValidatorRouter,
  localStateValidator: localStateValidatorRouter,
  globalStateValidator: globalStateValidatorRouter,
  courseGovernanceValidator: courseGovernanceValidatorRouter,

  // contribution features
  treasury: treasuryRouter,
  escrow: escrowRouter,
  task: taskRouter,
  contributorPrerequisite: contributorPrerequisiteRouter,

  // contribution onchain
  projectGeneral: projectGeneralRouter,
  projectValidators: projectValidatorsRouter,

  // admin
  andamioAdminTransactions: andamioAdminTxRouter,

  // premium features
  clientDomains: clientDomainsRouter,

  // experimental - transactions
  studentTransactions: studentTxRouter,
  courseCreatorTransactions: courseCreatorTxRouter,
  accessTokenTransactions: accessTokenTxRouter,
  projectManagerTransactions: projectManagerTxRouter,
  contributorTransactions: contributorTxRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
