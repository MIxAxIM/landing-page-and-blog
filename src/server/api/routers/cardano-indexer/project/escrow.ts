import { DecodedEscrowDatum } from "@andamiojs/datum-utils";
import { hexToString } from "@meshsdk/common";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Move to andamio/datum-utils:
// Core types for the UTxO data
type Asset = {
  unit: string;
  amount: string;
};

type DatumField = {
  bytes?: string;
  int?: number;
  list?: any[];
  constructor?: number;
  fields?: DatumField[];
};

type Datum = {
  type: string;
  hash: string;
  bytes: string;
  json: {
    constructor: number;
    fields: DatumField[];
  };
};

type EscrowUtxo = {
  tx_hash: string;
  index: number;
  slot: number;
  assets: Asset[];
  address: string;
  datum: Datum;
  reference_script: null | string;
  txout_cbor: null | string;
};

// Move to andamio/datum-utils:
export type DecodedEscrowUtxo = {
  txHash: string;
  index: number;
  slot: number;
  address: string;
  contributorAlias: string;
  datum: {
    hash: string;
    projectData: {
      taskHash: string;
      expirationTime: number;
      lovelace: number;
      additionalTokens: any[];
    };
    projectOwner: string;
    contributorPolicyId: string;
    info: string;
  };
};

export const escrowValidatorRouter = createTRPCRouter({
  getAllEscrowUtxosByTreasury: publicProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await indexerGetWithParams<EscrowUtxo[], { policy: string }>(
          `/escrow/utxos`,
          { policy: input.treasuryNftPolicyId },
        );

        return response.map((utxo): DecodedEscrowUtxo => {
          // Extract lovelace and escrow token amounts

          // Get datum fields safely
          const datumFields = utxo.datum.json.fields;
          const projectDataFields = datumFields[0]?.fields || [];

          return {
            txHash: utxo.tx_hash,
            index: utxo.index,
            slot: utxo.slot,
            address: utxo.address,
            contributorAlias: hexToString(utxo.assets[1]?.unit.substring(56) ?? ""),
            datum: {
              hash: utxo.datum.hash,
              projectData: {
                taskHash: projectDataFields[0]?.bytes ?? "",
                expirationTime: projectDataFields[1]?.int ?? 0,
                lovelace: projectDataFields[2]?.int ?? 0,
                additionalTokens: projectDataFields[3]?.list ?? [],
              },
              projectOwner: datumFields[1]?.bytes || '',
              contributorPolicyId: datumFields[2]?.bytes || '',
              info: hexToString(datumFields[3]?.fields?.[0]?.bytes || ''),
            },
          };
        });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Escrow UTxOs",
        });
      }
    }),

  getEscrowUtxoByTreasuryByAlias: publicProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
        alias: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await indexerGetWithParams<EscrowUtxo[], { treasuryNftPolicyId: string, alias: string }>(
          `/escrow/utxos`,
          { treasuryNftPolicyId: input.treasuryNftPolicyId, alias: input.alias },
        );

        // Since we're querying by alias, we expect only one result
        // But handle the array case safely
        const utxos = response.map((utxo): DecodedEscrowUtxo => {
          const datumFields = utxo.datum.json.fields;
          const projectDataFields = datumFields[0]?.fields || [];

          return {
            txHash: utxo.tx_hash,
            index: utxo.index,
            slot: utxo.slot,
            address: utxo.address,
            contributorAlias: hexToString(utxo.assets[1]?.unit.substring(56) ?? ""),
            datum: {
              hash: utxo.datum.hash,
              projectData: {
                taskHash: projectDataFields[0]?.bytes ?? "",
                expirationTime: projectDataFields[1]?.int ?? 0,
                lovelace: projectDataFields[2]?.int ?? 0,
                additionalTokens: projectDataFields[3]?.list ?? [],
              },
              projectOwner: datumFields[1]?.bytes || '',
              contributorPolicyId: datumFields[2]?.bytes || '',
              info: hexToString(datumFields[3]?.fields?.[0]?.bytes || ''),
            },
          };
        });

        // Return the first matching UTxO, or null if none found
        return utxos[0] ?? null;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Escrow UTxOs",
        });
      }
    }),

  getEscrowDecodedDatumByTreasuryByAlias: publicProcedure
    .input(
      z.object({
        policy: z.string().length(56),
        alias: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await indexerGetWithParams<DecodedEscrowDatum[], { policy: string, alias: string }>(
          `/escrow/decoded-datum`,
          { policy: input.policy, alias: input.alias },
        );
        return response
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Escrow Datum",
        });
      }
    }),

});

