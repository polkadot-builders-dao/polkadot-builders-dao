import { connectorsForWallets, getDefaultWallets } from "@rainbow-me/rainbowkit"
import { createClient, configureChains } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { CHAIN_ID } from "../settings"
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets"

import { supportedChains } from "./supportedChains"
import { talismanWallet } from "./talismanWallet"

export const chains = supportedChains.filter((chain) => chain.id === CHAIN_ID)

const { provider } = configureChains(chains, [publicProvider()])

// const { connectors } = getDefaultWallets({
//   appName: "Polkadot Builders",
//   chains,
// })

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      talismanWallet({ chains }),
      metaMaskWallet({ chains }),
      injectedWallet({ chains }),
      rainbowWallet({ chains }),
      walletConnectWallet({ chains }),
    ],
  },
])

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors,
})
