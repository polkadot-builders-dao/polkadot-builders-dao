import { connectorsForWallets } from "@rainbow-me/rainbowkit"
import { createClient, configureChains } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { CHAIN_ID } from "../settings"
import { injectedWallet, metaMaskWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets"

import { supportedChains } from "./supportedChains"
import { talismanWallet } from "./talismanWallet"

export const chains = supportedChains.filter((chain) => chain.id === CHAIN_ID)

const { provider } = configureChains(chains, [publicProvider()])

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      talismanWallet({ chains }),
      metaMaskWallet({ chains }),
      injectedWallet({ chains }),
      //rainbowWallet({ chains }), // can't add moonbeam network
      walletConnectWallet({ chains }), // doesn't seem to work
    ],
  },
])

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors,
})
