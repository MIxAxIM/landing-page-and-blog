import { z } from "zod";
import { DecodedModuleRefDatum } from "@andamiojs/datum-utils";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { indexerGetWithParams } from "~/lib/axios/indexer";

type ModuleRefQueryParams = {
  policy: string;
};

export const moduleRefValidatorRouter = createTRPCRouter({
  getDecodedDatum: protectedProcedure
    .input(
      z.object({
        courseNftPolicy: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const courseStateQueryParams: ModuleRefQueryParams = {
        policy: input.courseNftPolicy,
      };
      const moduleRefDatum = indexerGetWithParams<
        DecodedModuleRefDatum,
        ModuleRefQueryParams
      >(
        "/module-ref-validator/decoded-datum",
        courseStateQueryParams,
      );
      return moduleRefDatum;
    }),
});
