import { useMemo } from "react"
import { supportedChains } from "./wagmi/supportedChains"

export const useNativeCurrency = (chainId: number) => {
  const chain = useMemo(() => supportedChains.find((c) => c.id === chainId), [chainId])
  return chain?.nativeCurrency
}
