import { BigNumber, ethers } from "ethers"
import { useCallback, useMemo, useRef, useState } from "react"
import { useNetwork, useWaitForTransaction } from "wagmi"
import { Button } from "../../components/Button"
import { usePbAuctionHouseBid, usePbAuctionHouseGetAuction } from "../../contracts/generated"

export const BidInput = () => {
  const { data: auction } = usePbAuctionHouseGetAuction()
  //   const { data: amount } = usePbAuctionHouseAmount()
  //   const { data: minBid } = usePbAuctionHouseMinBid()
  //   const { data: minBidIncrement } = usePbAuctionHouseMinBidIncrementPercent()
  //   const { data: endDate } = usePbAuctionHouseEndTime()

  const minValue = useMemo(() => {
    if (!auction) return undefined
    return ethers.utils.formatEther(auction.minBid)
  }, [auction])

  const [bid, setBid] = useState<number>()
  const { chain } = useNetwork()

  const bnBid = useMemo(() => {
    return ethers.utils.parseEther((bid || 0).toString())
  }, [bid])

  const { writeAsync, data: txResult } = usePbAuctionHouseBid({ mode: "recklesslyUnprepared" })
  const refInput = useRef<HTMLInputElement>(null)
  const handleBid = useCallback(async () => {
    try {
      await writeAsync({
        recklesslySetUnpreparedOverrides: {
          value: bnBid,
        },
      })

      if (refInput.current) refInput.current.value = ""
    } catch (err) {
      console.error("Bid failed", { err })
    }
  }, [bnBid, writeAsync])

  //   const txReceipt = useWaitForTransaction({
  //     hash: txResult?.hash,
  //   })

  if (!auction || auction.isFinished) return null

  return (
    <div className="my-4 inline-flex items-center gap-2 rounded bg-neutral-800 py-1 px-2">
      <div className="flex items-center rounded bg-neutral-800 p-1  ">
        <input
          ref={refInput}
          className="bg-inherit px-2 text-right outline-none placeholder:text-neutral-600"
          type="number"
          placeholder={minValue}
          min={0}
          onChange={(e) => setBid(e.target.valueAsNumber)}
        />
        <div>{chain?.nativeCurrency.symbol}</div>
      </div>
      <div>
        <button className="rounded bg-pink-500 py-1 px-4 text-white" onClick={handleBid}>
          Place Bid
        </button>
      </div>
    </div>
  )
}
