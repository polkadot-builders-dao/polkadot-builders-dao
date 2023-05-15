import { connectorsForWallets } from "@rainbow-me/rainbowkit"
import { configureChains, createConfig } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { CHAIN_ID, WALLET_CONNECT_PROJECT_ID } from "../settings"
import { injectedWallet, metaMaskWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets"
import { createPublicClient, http } from "viem"

import { supportedChains } from "./supportedChains"
import { talismanWallet } from "./talismanWallet"

export const chain = supportedChains.find((chain) => chain.id === CHAIN_ID)

export const { chains, publicClient } = configureChains(
  supportedChains.filter((chain) => chain.id === CHAIN_ID),
  [publicProvider()]
)

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      talismanWallet({ chains }),
      metaMaskWallet({ chains }),
      injectedWallet({ chains }),
      walletConnectWallet({
        chains,
        projectId: WALLET_CONNECT_PROJECT_ID,
      }), // doesn't seem to work
    ],
  },
])

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient: createPublicClient({
    chain,
    transport: http(),
  }),
})
