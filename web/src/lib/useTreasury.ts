import { useBalance } from "wagmi"
import { useAuctionHouseGetConfig } from "../contracts/generated"
import { CHAIN_ID } from "./settings"
import { useBlockExplorerUrl } from "./useBlockExplorerUrl"
import { useMemo } from "react"

export const useTreasury = () => {
  const blockExplorerUrl = useBlockExplorerUrl(CHAIN_ID)
  const { data: config } = useAuctionHouseGetConfig({
    chainId: CHAIN_ID,
  })
  const { data: balance } = useBalance({
    address: config?.treasury,
    chainId: CHAIN_ID,
  })

  const url = useMemo(() => {
    if (!blockExplorerUrl) return ""
    return `${blockExplorerUrl}/tokenholdings?a=${config?.treasury}`
  }, [blockExplorerUrl, config?.treasury])

  return { balance, url }
}
