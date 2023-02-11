import { createClient, configureChains } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { CHAIN_ID } from "../settings"
import { injectedConnector } from "./injectedConnector"

import { supportedChains } from "./supportedChains"

const allowedChains = supportedChains.filter((chain) => chain.id === CHAIN_ID)

const { provider } = configureChains(allowedChains, [publicProvider()])

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors: [injectedConnector],
})
