import { useMemo } from "react"
import { NULL_ADDRESS } from "../../lib/constants"
import { CrestViewData } from "./useCrestDetailsDrawer"
import { CHAIN_ID } from "../../lib/settings"
import { useAuctionHouseGetAuction } from "../../contracts/generated"
import { BigNumber } from "ethers"

export type CrestHistoryEventBid = {
  id: string
  type: "bid"
  from: string
  value: string
  timestamp: string
  txHash: string
}

export type CrestHistoryEventTransfer = {
  id: string
  type: "mint" | "burn" | "transfer"
  from: string
  to: string
  timestamp: string
  txHash: string
}

export type CrestHistoryEvent = CrestHistoryEventBid | CrestHistoryEventTransfer

const getTransferType = (transfer: CrestViewData["transfers"][0]) => {
  if (transfer.from === NULL_ADDRESS) return "mint"
  if (transfer.to === NULL_ADDRESS) return "burn"
  return "transfer"
}

export const useCrestHistory = (crest: CrestViewData | null | undefined) => {
  const { data: auction } = useAuctionHouseGetAuction({
    chainId: CHAIN_ID,
    watch: true,
  })

  return useMemo<CrestHistoryEvent[] | undefined>(() => {
    // current bid might not have been picked up by the squid yet
    const currentBid: CrestHistoryEventBid | undefined =
      crest?.id &&
      auction?.tokenId.eq(crest.id) &&
      auction.currentBid.gt(BigNumber.from(0)) &&
      !crest.bids.some((b) => auction.currentBid.eq(b.value))
        ? {
            id: "current",
            type: "bid",
            from: auction.bidder,
            value: auction.currentBid.toString(),
            timestamp: "now",
            txHash: "",
          }
        : undefined
    const recentBids: CrestHistoryEventBid[] = currentBid ? [currentBid] : []

    if (!crest) return undefined

    return [
      ...recentBids,
      ...[
        ...crest.bids.map<CrestHistoryEventBid>((bid) => ({
          id: bid.id,
          type: "bid",
          from: bid.bidder,
          value: bid.value,
          timestamp: bid.timestamp,
          txHash: bid.txHash,
        })),
        ...crest.transfers.map<CrestHistoryEventTransfer>((transfer) => ({
          id: transfer.id,
          type: getTransferType(transfer),
          from: transfer.from,
          to: transfer.to,
          timestamp: transfer.timestamp,
          txHash: transfer.txHash,
        })),
      ].sort((a, b) => Number(b.timestamp) - Number(a.timestamp)),
    ]
  }, [auction, crest])
}
