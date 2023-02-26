import { useMemo } from "react"
import { supportedChains } from "./wagmi/supportedChains"

export const useBlockExplorerUrl = (chainId: number) => {
  return useMemo(
    () => supportedChains.find((c) => c.id === chainId)?.blockExplorers?.default.url,
    [chainId]
  )
}
