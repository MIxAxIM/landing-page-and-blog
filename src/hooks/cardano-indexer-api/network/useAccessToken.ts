import { type UTxO, type Asset, hexToString } from "@meshsdk/core";
import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@meshsdk/react";
import { ACCESS_TOKEN_POLICY_ID } from "~/andamio.config";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

interface UseAccessTokenReturn {
  accessTokenAsset: Asset | undefined;
  accessTokenUtxo: UTxO | undefined;
  accessTokenAlias: string | undefined;
  updateHasMintedAccessToken: (data: { userId: string, hasMinted: boolean, txHash: string }) => void;
  updateAccessTokenMintTx: (data: { userId: string, hasMinted: boolean, txHash: string }) => void;
}

export function useAccessToken(): UseAccessTokenReturn {
  const ctx = api.useUtils();
  const { connected, wallet } = useWallet();
  // placeholder:
  const [accessTokenAsset, setAccessTokenAsset] = useState<Asset | undefined>(
    undefined,
  );
  const [accessTokenUtxo, setAccessTokenUtxo] = useState<UTxO | undefined>(
    undefined,
  );
  const [accessTokenAlias, setAccessTokenAlias] = useState<string | undefined>(
    undefined,
  );

  // Helper function to invalidate and refetch queries
  const refreshQueries = async () => {
    await Promise.all([
      // Invalidate all relevant queries
      ctx.user.getUserById.invalidate(),
      ctx.user.getUserByName.invalidate(),
    ]);
  };


  const updateHasMintedAccessTokenMutation = api.user.updateHasMintedAccessToken.useMutation({
    onSuccess: async () => {
      toast.success("Successfully minted access token");
      await refreshQueries();
    },
    onError: (error) => {
      if (!!error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update access token status");
      }
    },
  });

  const updateAccessTokenMintTxMutation = api.user.updateAccessTokenMintTx.useMutation({
    onSuccess: async () => {
      toast.success("Access Token confirmed on Cardano");
      await refreshQueries();
    },
    onError: (error) => {
      if (!!error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update access token mint tx hash");
      }
    },
  });

  const getAssetTokenUtxo = useCallback(async () => {
    if (!!wallet) {
      const utxos: UTxO[] | undefined = await wallet.getUtxos();
      const atUtxo: UTxO | undefined = utxos.find((utxo: UTxO) => {
        return utxo.output.amount.some((a: Asset) =>
          a.unit.startsWith(ACCESS_TOKEN_POLICY_ID),
        );
      });
      if (atUtxo) {
        setAccessTokenUtxo(atUtxo);
        const atAsset: Asset | undefined = atUtxo.output.amount.find(
          (asset: Asset) => asset.unit.includes(ACCESS_TOKEN_POLICY_ID),
        );
        if (atAsset) {
          const alias = hexToString(atAsset.unit.substring(62));
          setAccessTokenAsset(atAsset);
          setAccessTokenAlias(alias);
        }
      }
    }
  }, [wallet]);

  useEffect(() => {
    if (connected) {
      void getAssetTokenUtxo();
    } else {
      setAccessTokenUtxo(undefined);
      setAccessTokenAsset(undefined);
      setAccessTokenAlias(undefined);
    }
  }, [wallet, getAssetTokenUtxo, connected]);

  return {
    accessTokenAsset,
    accessTokenUtxo,
    accessTokenAlias,
    updateHasMintedAccessToken: updateHasMintedAccessTokenMutation.mutate,
    updateAccessTokenMintTx: updateAccessTokenMintTxMutation.mutate,
  };
};
