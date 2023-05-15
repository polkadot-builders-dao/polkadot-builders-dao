import { FC, PropsWithChildren } from "react"
import { WagmiConfig } from "wagmi"
import { chains, wagmiConfig } from "./wagmiClient"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { rainbowTheme } from "./rainbowTheme"
import { Avatar } from "../../components/Avatar"

export const WagmiProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        appInfo={{
          appName: "Polkadot Builders",
        }}
        coolMode
        theme={rainbowTheme}
        chains={chains}
        avatar={Avatar}
        showRecentTransactions
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
