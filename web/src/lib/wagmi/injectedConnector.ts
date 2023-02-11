import { InjectedConnector } from "wagmi/connectors/injected"
import { supportedChains } from "./supportedChains"

export const injectedConnector = new InjectedConnector({
  chains: supportedChains,
})
