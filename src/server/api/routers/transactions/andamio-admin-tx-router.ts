import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type InitCourseStepOneParams = {
  aliases: string[];
};

type InitCourseStepTwoAndThreeParams = {
  policy: string;
};

type AddRemoveCourseCreatorParams = {
  aliases: string[];
  policy: string;
};

export const andamioAdminTxRouter = createTRPCRouter({
  initCourseStepOne: publicProcedure
    .input(
      z.object({
        aliases: z.array(z.string().min(1)),
      }),
    )
    .query(async ({ input }) => {
      const stepOneParams: InitCourseStepOneParams = {
        aliases: input.aliases,
      };
      const builtTxResponse = await indexerGetWithParams<
        { courseNftPolicyId: string; unsignedTxCBOR: string },
        InitCourseStepOneParams
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
      const stepTwoParams: InitCourseStepTwoAndThreeParams = {
        policy: input.policy,
      };
      const builtTxResponse = await indexerGetWithParams<
        { courseNftPolicyId: string; unsignedTxCBOR: string },
        InitCourseStepTwoAndThreeParams
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
      const stepThreeParams: InitCourseStepTwoAndThreeParams = {
        policy: input.policy,
      };
      const builtTxResponse = await indexerGetWithParams<
        { courseNftPolicyId: string; unsignedTxCBOR: string },
        InitCourseStepTwoAndThreeParams
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

      https: if (builtTxResponse) return builtTxResponse;
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

      https: if (builtTxResponse) return builtTxResponse;
      else throw new Error("Could not remove course creators");
    }),
});
