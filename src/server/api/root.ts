import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/database/user/user";
import { userWalletRouter } from "./routers/database/user/user-wallet";

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

import { learnerCourseTxRouter } from "./routers/transactions/learner-course-tx-router";
import { creatorCourseTxRouter } from "./routers/transactions/creator-course-tx-router";
import { accessTokenTxRouter } from "./routers/transactions/access-token-router";
import { andamioAdminTxRouter } from "./routers/transactions/andamio-admin-tx-router";
import { treasuryRouter } from "./routers/database/contributor/treasury";
import { escrowRouter } from "./routers/database/contributor/escrow";
import { taskRouter } from "./routers/database/contributor/task";
import { contributorPrerequisiteRouter } from "./routers/database/contributor/contributor-prerequisite";
import { escrowPrerequisitesRouter } from "./routers/database/contributor/escrow-contributor-prerequisites";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  userWallet: userWalletRouter,
  creator: creatorRouter,
  learner: learnerRouter,

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
  escrowContributorPrerequisites: escrowPrerequisitesRouter,

  // admin
  andamioAdminTransactions: andamioAdminTxRouter,

  // premium features
  clientDomains: clientDomainsRouter,

  // experimental - transactions
  learnerCourseTransactions: learnerCourseTxRouter,
  creatorCourseTransactions: creatorCourseTxRouter,
  accessTokenTransactions: accessTokenTxRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
