"use client";

import type { Chain } from "@chain-registry/types";
import { ChainProvider } from "@cosmos-kit/react";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { assets, chains } from "chain-registry";

import { CosmosWalletProvider } from "./features/CosmosWallet";
import { EvmWalletProvider } from "./features/EvmWallet";
import { NotificationsContextProvider } from "./features/Notifications";
import {
  ConfigContextProvider,
  cosmosChainInfosToCosmosKitAssetLists,
  cosmosChainInfosToCosmosKitChains,
  evmChainsToRainbowKitChains,
  getAllChainConfigs,
} from "./config";

// TODO - move to envar
const WALLET_CONNECT_PROJECT_ID = "b1a4f5a9bc91120e74a7df1dd785b336";

export function Providers({ children }: { children: React.ReactNode }) {
  const { evm: evmChains, cosmos: cosmosChains } = getAllChainConfigs();

  // wagmi and rainbowkit config, for evm chains
  const rainbowKitConfig = getDefaultConfig({
    appName: "Flame Bridge",
    projectId: WALLET_CONNECT_PROJECT_ID,
    chains: evmChainsToRainbowKitChains(evmChains),
  });

  const queryClient = new QueryClient();

  // cosmoskit config
  const cosmosWalletConnectOptions = {
    signClient: {
      projectId: WALLET_CONNECT_PROJECT_ID,
    },
  };

  const cosmosKitChains = cosmosChainInfosToCosmosKitChains(cosmosChains);
  const cosmosKitAssetLists =
    cosmosChainInfosToCosmosKitAssetLists(cosmosChains);

  return (
    <ConfigContextProvider>
      <NotificationsContextProvider>
        <WagmiProvider config={rainbowKitConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <ChainProvider
                assetLists={[...assets, ...cosmosKitAssetLists]}
                chains={[...chains, ...cosmosKitChains]}
                wallets={[...keplrWallets, ...leapWallets]}
                walletConnectOptions={cosmosWalletConnectOptions}
                signerOptions={{
                  preferredSignType: (chain: string | Chain) => {
                    return "amino";
                  },
                }}
              >
                <CosmosWalletProvider>
                  <EvmWalletProvider>{children}</EvmWalletProvider>
                </CosmosWalletProvider>
              </ChainProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </NotificationsContextProvider>
    </ConfigContextProvider>
  );
}