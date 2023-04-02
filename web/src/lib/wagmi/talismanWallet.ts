import type { InjectedConnectorOptions } from "@wagmi/core/dist/connectors/injected"
import { Chain, Wallet } from "@rainbow-me/rainbowkit"
import { TalismanConnector } from "@talismn/wagmi-connector"

export interface TalismanWalletOptions {
  chains: Chain[]
}

export const talismanWallet = ({
  chains,
}: TalismanWalletOptions & InjectedConnectorOptions): Wallet => ({
  id: "talisman",
  name: "Talisman",
  iconUrl: async () => (await import("./logos/talisman.svg")).default,
  iconBackground: "#fd4848",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  installed: typeof window !== "undefined" && !!(window as any).talismanEth?.isTalisman,
  downloadUrls: {
    browserExtension: "https://talisman.xyz/download",
  },
  createConnector: () => ({
    connector: new TalismanConnector({ chains }),
  }),
})
