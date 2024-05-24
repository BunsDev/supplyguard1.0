"use client";

import React, { ReactNode } from "react";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { State, WagmiProvider } from "wagmi";
import { config, projectId } from "./config";

const Filecoin = {
  chainId: 314159,
  name: "Filecoin - Calibration testnet",
  currency: "tFIL",
  explorerUrl: "https://calibration.filscan.io",
  rpcUrl: "https://filecoin-calibration.chainup.net/rpc/v1",
} as any;

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  defaultChain: Filecoin,
  enableAnalytics: true, // Optional
  themeMode: "light",
});

export const WagmiProviderComp = ({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // configure as per your needs
          },
        },
      })
  );

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
export default WagmiProviderComp;
