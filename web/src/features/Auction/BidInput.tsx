import { ethers } from "ethers"
import { useCallback, useMemo, useRef, useState } from "react"
import { Id } from "react-toastify"
import { useChainId } from "wagmi"
import { showToastAlert } from "../../components/ToastAlert"
import { usePbAuctionHouseBid, usePbAuctionHouseGetAuction } from "../../contracts/generated"
import { CHAIN_ID } from "../../lib/settings"
import { useNativeCurrency } from "../../lib/useNativeCurrency"
import { useWallet } from "../../lib/useWallet"

export const BidInput = () => {
  const chainId = useChainId()
  const { isConnected, connect } = useWallet()
  const { data: auction, refetch } = usePbAuctionHouseGetAuction({
    chainId: CHAIN_ID,
  })

  const minValue = useMemo(() => {
    if (!auction) return undefined
    return Number(ethers.utils.formatEther(auction.minBid)).toFixed(2)
  }, [auction])

  const [bid, setBid] = useState<number>()

  const currency = useNativeCurrency(chainId)

  const bnBid = useMemo(() => {
    return bid
      ? ethers.utils.parseEther((bid || 0).toString())
      : auction?.minBid ?? ethers.BigNumber.from(0)
  }, [auction?.minBid, bid])

  const { writeAsync, data: txResult } = usePbAuctionHouseBid({ mode: "recklesslyUnprepared" })
  const refInput = useRef<HTMLInputElement>(null)
  const handleBid = useCallback(async () => {
    let toastId: Id | undefined
    try {
      if (!isConnected) {
        connect()
        return
      }

      const tx = await writeAsync({
        recklesslySetUnpreparedOverrides: {
          value: bnBid,
        },
      })
      if (refInput.current) refInput.current.value = ""

      toastId = showToastAlert("loading", "Bid submitted", "Waiting for confirmation...", {
        autoClose: false,
      })

      const receipt = await tx.wait(1)

      if (receipt.status)
        showToastAlert("success", "Bid confirmed", "Your bid has been confirmed", {
          toastId,
          autoClose: 3000,
        })
      else
        showToastAlert("success", "Bid rejected", "Your bid has been cancelled", {
          toastId,
          autoClose: 10000,
        })
      refetch()
    } catch (err) {
      console.error("Cannot bid", { err })
      showToastAlert("error", "Cannot bid", (err as Error).message, {
        toastId,
        autoClose: 3000,
      })
      refetch()
    }
  }, [bnBid, connect, isConnected, refetch, writeAsync])

  if (!auction || auction.isFinished) return null

  return (
    <div className="inline-flex w-96 items-center gap-2">
      <div className="inline-flex h-10 grow items-center overflow-hidden rounded bg-neutral-700 px-2 outline-neutral-600 focus-within:outline">
        <input
          ref={refInput}
          className="min-w-0 grow bg-inherit px-2 text-right outline-none placeholder:text-neutral-500"
          type="number"
          placeholder={`${minValue} or more`}
          min={0}
          onChange={(e) => setBid(e.target.valueAsNumber)}
        />
        <div>{currency?.symbol}</div>
      </div>
      <button className="primary" onClick={handleBid}>
        Place Bid
      </button>
    </div>
  )
}
