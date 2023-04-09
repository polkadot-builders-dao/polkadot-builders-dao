import { Chain } from "wagmi"

// PROD
const moonbeam: Chain = {
  id: 1284,
  name: "Moonbeam",
  network: "moonbeam",
  nativeCurrency: {
    decimals: 18,
    name: "Glimmer",
    symbol: "GLMR",
  },
  rpcUrls: {
    default: { http: ["https://rpc.api.moonbeam.network"] },
    public: { http: ["https://rpc.api.moonbeam.network"] },
  },
  blockExplorers: {
    etherscan: { name: "Moonscan", url: "https://moonbeam.moonscan.io" },
    default: { name: "Moonscan", url: "https://moonbeam.moonscan.io" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 609002,
    },
  },
}

// DEV ONLY
const hardhat: Chain = {
  id: 31337,
  name: "Hardhat",
  network: "hardhat",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
  blockExplorers: {
    etherscan: { name: "Moonscan", url: "https://moonbeam.moonscan.io" },
    default: { name: "Moonscan", url: "https://moonbeam.moonscan.io" },
  },
}

// TEST ONLY
const moonbase: Chain = {
  id: 1287,
  name: "Moonbase Alpha",
  network: "moonbase",
  nativeCurrency: {
    decimals: 18,
    name: "DEV Glimmer",
    symbol: "DEV",
  },
  rpcUrls: {
    default: { http: ["https://rpc.api.moonbase.moonbeam.network"] },
    public: { http: ["https://rpc.api.moonbase.moonbeam.network"] },
  },
  blockExplorers: {
    etherscan: { name: "Moonscan", url: "https://moonbase.moonscan.io" },
    default: { name: "Moonscan", url: "https://moonbase.moonscan.io" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 609002,
    },
  },
}

export const supportedChains: Chain[] = [moonbeam, moonbase, hardhat]
