import { getDefaultWallets } from "@rainbow-me/rainbowkit"
import { createClient, configureChains } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { CHAIN_ID } from "../settings"

import { supportedChains } from "./supportedChains"

export const chains = supportedChains.filter((chain) => chain.id === CHAIN_ID)

const { provider } = configureChains(chains, [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: "Polkadot Builders",
  chains,
})

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors,
})
