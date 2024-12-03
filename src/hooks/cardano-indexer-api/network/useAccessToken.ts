import { type UTxO, type Asset, hexToString } from "@meshsdk/core";
import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@meshsdk/react";
import { ACCESS_TOKEN_POLICY_ID } from "~/andamio.config";

export const useAccessToken = () => {
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
  };
};
