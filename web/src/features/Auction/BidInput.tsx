import { useConnectModal } from "@rainbow-me/rainbowkit"
import { BigNumber, ethers } from "ethers"
import { useCallback, useMemo, useRef, useState } from "react"
import { Id } from "react-toastify"
import { useAccount, useChainId } from "wagmi"
import { showToastAlert } from "../../components/ToastAlert"
import { useAuctionHouseBid, useAuctionHouseGetAuction } from "../../contracts/generated"
import { CHAIN_ID } from "../../lib/settings"
import { useNativeCurrency } from "../../lib/useNativeCurrency"

export const BidInput = () => {
  const chainId = useChainId()
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()
  const { data: auction, refetch } = useAuctionHouseGetAuction({
    chainId: CHAIN_ID,
  })

  const minValue = useMemo(() => {
    if (!auction) return undefined
    return ethers.utils.formatEther(auction.minBid)
  }, [auction])

  const [bid, setBid] = useState<number>()

  const currency = useNativeCurrency(chainId)

  const bnBid = useMemo(() => {
    return bid
      ? ethers.utils.parseEther((bid || 0).toString())
      : auction?.minBid ?? ethers.BigNumber.from(0)
  }, [auction?.minBid, bid])

  const { writeAsync } = useAuctionHouseBid({
    mode: "recklesslyUnprepared",
    chainId: CHAIN_ID,
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const refInput = useRef<HTMLInputElement>(null)
  const handleBid = useCallback(async () => {
    let toastId: Id | undefined
    try {
      if (!isConnected) {
        openConnectModal?.()
        return
      }

      setIsProcessing(true)
      const tx = await writeAsync({
        recklesslySetUnpreparedOverrides: {
          value: bnBid,
          gasLimit: BigNumber.from("100000"), // supposed to be 86400 but can vary if tx triggers extented time limit
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
        showToastAlert("error", "Bid rejected", "Your bid has been cancelled", {
          toastId,
          autoClose: 10000,
        })
      refetch()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Cannot bid", { err })

      let errorMessage = (err as Error).message
      if (errorMessage.includes("evm error: OutOfFund")) errorMessage = "Insufficient funds"

      showToastAlert("error", "Cannot bid", errorMessage, {
        toastId,
        autoClose: 3000,
      })
      refetch()
    }
    setIsProcessing(false)
  }, [bnBid, openConnectModal, isConnected, refetch, writeAsync])

  if (!auction || auction.isFinished) return null

  return (
    <div className="inline-flex w-full items-center gap-2">
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
      <button className="btn primary" onClick={handleBid} disabled={isProcessing}>
        <span className="hidden sm:inline">Place</span> Bid
      </button>
    </div>
  )
}
