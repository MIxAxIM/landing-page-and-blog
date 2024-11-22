import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type InitStepOneParams = {
  aliases: string[];
};

type InitStepTwoAndThreeParams = {
  policy: string;
};

type InitStepFourParams = {
  policy: string;
  prerequisite: string;
}

type AddRemoveCourseCreatorParams = {
  aliases: string[];
  policy: string;
};


// TODO: Confirm that list of aliases is working
export const andamioAdminTxRouter = createTRPCRouter({
  initCourseStepOne: publicProcedure
    .input(
      z.object({
        aliases: z.array(z.string().min(1)),
      }),
    )
    .query(async ({ input }) => {
      const stepOneParams: InitStepOneParams = {
        aliases: input.aliases,
      };
      const builtTxResponse = await indexerGetWithParams<
        { courseNftPolicyId: string; unsignedTxCBOR: string },
        InitStepOneParams
      >(`/tx/admin/init-course-step-1`, stepOneParams);

      if (builtTxResponse) return builtTxResponse;
      else throw new Error("Could not complete step 1");
    }),

  initCourseStepTwo: publicProcedure
    .input(
      z.object({
        policy: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const stepTwoParams: InitStepTwoAndThreeParams = {
        policy: input.policy,
      };
      const builtTxResponse = await indexerGetWithParams<
        { courseNftPolicyId: string; unsignedTxCBOR: string },
        InitStepTwoAndThreeParams
      >(`/tx/admin/init-course-step-2`, stepTwoParams);

      if (builtTxResponse) return builtTxResponse;
      else throw new Error("Could not complete step 2");
    }),

  initCourseStepThree: publicProcedure
    .input(
      z.object({
        policy: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const stepThreeParams: InitStepTwoAndThreeParams = {
        policy: input.policy,
      };
      const builtTxResponse = await indexerGetWithParams<
        { courseNftPolicyId: string; unsignedTxCBOR: string },
        InitStepTwoAndThreeParams
      >(`/tx/admin/init-course-step-3`, stepThreeParams);

      if (builtTxResponse) return builtTxResponse;
      else throw new Error("Could not complete step 3");
    }),

  addCourseTeacher: publicProcedure
    .input(
      z.object({
        aliases: z.array(z.string().min(1)),
        policy: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const creatorParams: AddRemoveCourseCreatorParams = {
        aliases: input.aliases,
        policy: input.policy,
      };
      const builtTxResponse = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        AddRemoveCourseCreatorParams
      >(`/tx/admin/add-course-creators`, creatorParams);

      if (builtTxResponse) return builtTxResponse;
      else throw new Error("Could not add course creators");
    }),

  removeCourseTeacher: publicProcedure
    .input(
      z.object({
        aliases: z.array(z.string().min(1)),
        policy: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const creatorParams: AddRemoveCourseCreatorParams = {
        aliases: input.aliases,
        policy: input.policy,
      };
      const builtTxResponse = await indexerGetWithParams<
        { unsignedTxCBOR: string },
        AddRemoveCourseCreatorParams
      >(`/tx/admin/rm-course-creators`, creatorParams);

      if (builtTxResponse) return builtTxResponse;
      else throw new Error("Could not remove course creators");
    }),

  // Project Contribution Routers
  initProjectStepOne: publicProcedure
    .input(
      z.object({
        aliases: z.array(z.string().min(1)),
      }),
    )
    .query(async ({ input }) => {
      const stepOneParams: InitStepOneParams = {
        aliases: input.aliases,
      };
      console.log("check88888", stepOneParams)
      const builtTxResponse = await indexerGetWithParams<
        { projectNftPolicyId: string; unsignedTxCBOR: string },
        InitStepOneParams
      >(`/tx/admin/init-project-step-1`, stepOneParams);
      if (builtTxResponse) return builtTxResponse;
      else throw new Error("Could not complete step 1");
    }),
  initProjectStepTwo: publicProcedure
    .input(
      z.object({
        policy: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const stepTwoParams: InitStepTwoAndThreeParams = {
        policy: input.policy,
      };
      const builtTxResponse = await indexerGetWithParams<
        { projectNftPolicyId: string; unsignedTxCBOR: string },
        InitStepTwoAndThreeParams
      >(`/tx/admin/init-project-step-2`, stepTwoParams);
      if (builtTxResponse) return builtTxResponse;
      else throw new Error("Could not complete step 2");
    }),
  initProjectStepThree: publicProcedure
    .input(
      z.object({
        policy: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const stepThreeParams: InitStepTwoAndThreeParams = {
        policy: input.policy,
      };
      try {
        const builtTxResponse = await indexerGetWithParams<
          { projectNftPolicyId: string; unsignedTxCBOR: string },
          InitStepTwoAndThreeParams
        >(`/tx/admin/init-project-step-3`, stepThreeParams);
        if (builtTxResponse) return builtTxResponse;
        else throw new Error("Could not complete step 3");
      }
      catch (error) {
        console.log(error)
      }
    }),
  initProjectStepFour: publicProcedure
    .input(
      z.object({
        policy: z.string().length(56),
        prerequisite: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const stepFourParams: InitStepFourParams = {
        policy: input.policy,
        prerequisite: input.prerequisite,
      };
      try {
        const builtTxResponse = await indexerGetWithParams<
          { projectNftPolicyId: string; unsignedTxCBOR: string },
          InitStepFourParams
        >(`/tx/admin/init-project-step-4`, stepFourParams);
        if (builtTxResponse) return builtTxResponse;
        else throw new Error("Could not complete step 4");
      }
      catch (error) {
        console.log(error)
      }
    }),
});
