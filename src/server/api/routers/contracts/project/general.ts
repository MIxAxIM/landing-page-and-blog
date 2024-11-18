import { UtxoWithSlot } from "@maestro-org/typescript-sdk";
import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";

export const projectGeneralRouter = createTRPCRouter({
    getInstancesInfo: protectedProcedure.query(async () => {
        const instances = await indexerGetWithParams<UtxoWithSlot[], any>("/instance-validator/utxos", {
            filter: 'TreasuryScripts'
        })
        const policies = instances.map(utxo => {
            return JSON.parse(JSON.stringify(utxo.datum!.json)).bytes as string;
        });
        return {
            policies: policies
        }
    }),

})