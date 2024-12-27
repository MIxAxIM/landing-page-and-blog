import { z } from "zod";
import { type DecodedModuleRefDatum } from "@andamiojs/datum-utils";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { indexerGetWithParams } from "~/lib/axios/indexer";
import { hexToString } from "@meshsdk/common";

type ModuleRefQueryParams = {
  policy: string;
};

type DecodedSlt = {
  index: number,
  text: string,
};

export type ModuleRefUtxo = {
  moduleCode: string;
  tx_hash: string;
  assets: {
    unit: string;
    amount: string;
  }[];
  address: string;
  datum_hash: string;
  slts: DecodedSlt[]
};


export const moduleRefValidatorRouter = createTRPCRouter({
  // TODO: We can probably do without this endpoint. It is currently reference twice. Try to replace these refernces with getDecodedDatum
  getUtxos: protectedProcedure
    .input(
      z.object({
        courseNftPolicy: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const moduleRefQueryParams: ModuleRefQueryParams = {
        policy: input.courseNftPolicy,
      };

      const utxos = await indexerGetWithParams<
        any[],
        ModuleRefQueryParams
      >("/module-ref-validator/utxos", moduleRefQueryParams);

      return utxos.map(utxo => {
        const slts = utxo.datum?.json.fields[0].list.map((slt: { constructor: 0, fields: [{ bytes: string }, { bytes: string }] }) => ({
          index: parseInt(Buffer.from(slt.fields[0].bytes, 'hex').toString()),
          text: Buffer.from(slt.fields[1].bytes, 'hex').toString()
        }));

        return {
          moduleCode: hexToString(utxo.assets[1].unit.substring(56)),
          tx_hash: utxo.tx_hash,
          assets: utxo.assets,
          address: utxo.address,
          datum_hash: utxo.datum?.hash ?? "",
          slts
        } satisfies ModuleRefUtxo;
      });
    }),

  getDecodedDatum: protectedProcedure
    .input(
      z.object({
        courseNftPolicy: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const moduleRefQueryParams: ModuleRefQueryParams = {
        policy: input.courseNftPolicy,
      };
      const result = indexerGetWithParams<
        DecodedModuleRefDatum[],
        ModuleRefQueryParams
      >(
        "/module-ref-validator/decoded-datum",
        moduleRefQueryParams,
      );
      return result;
    }),
});
