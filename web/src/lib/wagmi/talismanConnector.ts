import { TalismanConnector } from "@talismn/wagmi-connector"
import { supportedChains } from "./supportedChains"

export const talismanConnector = new TalismanConnector({
  chains: supportedChains,
})
