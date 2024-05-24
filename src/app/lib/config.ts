// lib/config.ts

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export const projectId = "6a1ea1cb75d52415bb4110fa68566498";

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Web3Modal Example",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const Filecoin = {
  id: 314159,
  name: "Filecoin - Calibration testnet",
  network: "Filecoin - Calibration testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Filecoin - Calibration testnet",
    symbol: "tFIL",
  },
  rpcUrls: {
    default: {
      http: ["https://filecoin-calibration.chainup.net/rpc/v1"],
    },
  },
  blockExplorers: {
    default: {
      name: "Apothem Explorer",
      url: "https://calibration.filscan.io",
    },
  },
  testnet: true,
};

export const config = defaultWagmiConfig({
  chains: [Filecoin],
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  enableEmail: true,
});
