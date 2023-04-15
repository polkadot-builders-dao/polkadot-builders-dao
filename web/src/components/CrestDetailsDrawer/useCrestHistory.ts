import { useMemo } from "react"
import { NULL_ADDRESS } from "../../lib/constants"
import { CrestViewData } from "./useCrestDetailsDrawer"

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

// type CrestHistoryEvent = {
//   id: string
//   type: "mint" | "burn" | "bid" | "transfer"
//   from: string
//   to?: string
//   value?: string
//   timestamp: string
//   txHash: string
// }

export type CrestHistoryEvent = CrestHistoryEventBid | CrestHistoryEventTransfer

const getTransferType = (transfer: CrestViewData["transfers"][0]) => {
  if (transfer.from === NULL_ADDRESS) return "mint"
  if (transfer.to === NULL_ADDRESS) return "burn"
  return "transfer"
}

export const useCrestHistory = (crest: CrestViewData | null | undefined) => {
  return useMemo<CrestHistoryEvent[] | undefined>(() => {
    if (!crest) return undefined
    return [
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
    ].sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
  }, [crest])
}
