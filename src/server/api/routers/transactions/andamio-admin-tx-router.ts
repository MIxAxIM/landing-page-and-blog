import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type InitCourseParams = {
  aliases: string[];
};

type InitProjectParams = {
  aliases: string[];
};

type InitProjectWithPrerequisiteParams = {
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
      const stepOneParams: InitCourseParams = {
        aliases: input.aliases,
      };
      const builtTxResponse = await indexerGetWithParams<
        { courseNftPolicyId: string; unsignedTxCBOR: string },
        InitCourseParams
      >(`/tx/admin/init-course`, stepOneParams);

      if (builtTxResponse) return builtTxResponse;
      else throw new Error("Could not Initialize Course");
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
      const stepOneParams: InitProjectParams = {
        aliases: input.aliases,
      };
      console.log("check88888", stepOneParams)
      const builtTxResponse = await indexerGetWithParams<
        { projectNftPolicyId: string; unsignedTxCBOR: string },
        InitProjectParams
      >(`/tx/admin/init-project-step-1`, stepOneParams);
      if (builtTxResponse) return builtTxResponse;
      else throw new Error("Could not complete step 1");
    }),

  initProjectStepTwo: publicProcedure
    .input(
      z.object({
        policy: z.string().length(56),
        prerequisite: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const stepFourParams: InitProjectWithPrerequisiteParams = {
        policy: input.policy,
        prerequisite: input.prerequisite,
      };
      try {
        const builtTxResponse = await indexerGetWithParams<
          { projectNftPolicyId: string; unsignedTxCBOR: string },
          InitProjectWithPrerequisiteParams
        >(`/tx/admin/init-project-step-2`, stepFourParams);
        if (builtTxResponse) return builtTxResponse;
        else throw new Error("Could not complete step 4");
      }
      catch (error) {
        console.log(error)
      }
    }),
});
