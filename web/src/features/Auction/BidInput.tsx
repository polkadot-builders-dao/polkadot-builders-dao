import { useConnectModal } from "@rainbow-me/rainbowkit"
import { FC, useCallback, useMemo, useRef, useState } from "react"
import { Id } from "react-toastify"
import { useAccount, useChainId } from "wagmi"
import { showToastAlert } from "../../components/ToastAlert"
import { useAuctionHouseBid, usePrepareAuctionHouseBid } from "../../contracts/generated"
import { CHAIN_ID } from "../../lib/settings"
import { useNativeCurrency } from "../../lib/useNativeCurrency"
import { waitForTransaction } from "wagmi/actions"
import { ContractFunctionExecutionError, formatEther, parseEther } from "viem"
import { AuctionData } from "../../contracts/types"

const getErrorMessage = (err: unknown) => {
  if (!err) return undefined

  let errorMessage = (err as ContractFunctionExecutionError).details
  if (errorMessage?.includes("evm error: OutOfFund")) errorMessage = "Insufficient funds"
  if (errorMessage?.startsWith("VM Exception while processing transaction: revert "))
    errorMessage = errorMessage.slice(50)

  return errorMessage ?? (err as Error).message ?? err?.toString()
}

export const BidInput: FC<{ auction: AuctionData; refetchAuction: () => void }> = ({
  auction,
  refetchAuction,
}) => {
  const chainId = useChainId()
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()

  const minValue = useMemo(() => {
    if (!auction) return undefined
    return formatEther(auction.minBid)
  }, [auction])

  const [bid, setBid] = useState<number>()

  const currency = useNativeCurrency(chainId)

  const bnBid = useMemo(() => {
    return bid ? parseEther(`${bid}` || "0") : auction?.minBid ?? 0n
  }, [auction?.minBid, bid])

  const { config, error, isError, isLoading } = usePrepareAuctionHouseBid({
    value: bnBid,
    gas: 100000n, // supposed to be 86400 but can vary if tx triggers extented time limit
    chainId: CHAIN_ID,
    enabled: !auction?.isFinished && bnBid > 0n,
  })

  const errorMessage = useMemo(() => getErrorMessage(error), [error])

  const { writeAsync } = useAuctionHouseBid(config)

  const [isProcessing, setIsProcessing] = useState(false)
  const refInput = useRef<HTMLInputElement>(null)
  const handleBid = useCallback(async () => {
    let toastId: Id | undefined
    try {
      if (!isConnected) {
        openConnectModal?.()
        return
      }

      if (error || !writeAsync) return

      setIsProcessing(true)
      const { hash } = await writeAsync()
      if (refInput.current) refInput.current.value = ""
      setBid(undefined)

      toastId = showToastAlert("loading", "Bid submitted", "Waiting for confirmation...", {
        autoClose: false,
      })

      const receipt = await waitForTransaction({ chainId: CHAIN_ID, hash })

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
      refetchAuction()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Cannot bid", { err })

      const errorMessage = getErrorMessage(err)

      showToastAlert("error", "Cannot bid", errorMessage, {
        toastId,
        autoClose: 3000,
      })
      refetchAuction()
    }
    setIsProcessing(false)
  }, [isConnected, error, writeAsync, refetchAuction, openConnectModal])

  if (!auction || auction.isFinished) return null

  return (
    <div>
      <div className="inline-flex w-full items-center gap-2">
        <div className="inline-flex h-10 grow items-center overflow-hidden rounded bg-neutral-700 px-2 outline-neutral-600 focus-within:outline">
          <input
            ref={refInput}
            className="min-w-0 grow bg-inherit px-2 text-right outline-none placeholder:text-neutral-500"
            type="number"
            inputMode="decimal"
            placeholder={`${minValue} or more`}
            min={0}
            onChange={(e) => setBid(e.target.valueAsNumber)}
            onKeyUp={(e) => {
              if (isProcessing || isError || isLoading) return
              if (e.key === "Enter") handleBid()
            }}
          />
          <div>{currency?.symbol}</div>
        </div>

        <button
          type="submit"
          className="btn primary"
          onClick={handleBid}
          disabled={isProcessing || isError || isLoading}
        >
          <span className="hidden sm:inline">Place</span> Bid
        </button>
      </div>
      <div className="visible mt-1 text-xs text-red-500">{errorMessage ?? <>&nbsp;</>}</div>
    </div>
  )
}
