import { FC, PropsWithChildren } from "react"
import { WagmiConfig } from "wagmi"
import { chains, wagmiClient } from "./wagmiClient"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { rainbowTheme } from "./rainbowTheme"
import { CustomAvatar } from "../../components/Avatar"

export const WagmiProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        appInfo={{
          appName: "Polkadot Builders",
        }}
        coolMode
        theme={rainbowTheme}
        chains={chains}
        avatar={CustomAvatar}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
