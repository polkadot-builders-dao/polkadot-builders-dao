import { createClient, configureChains } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { CHAIN_ID } from "../settings"

import { supportedChains } from "./supportedChains"
import { InjectedConnector } from "wagmi/connectors/injected"

const injectedConnector = new InjectedConnector({
  chains: supportedChains,
})

const allowedChains = supportedChains.filter((chain) => chain.id === CHAIN_ID)

const { provider } = configureChains(allowedChains, [publicProvider()])

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors: [injectedConnector],
})
