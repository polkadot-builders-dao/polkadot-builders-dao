import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useCallback } from "react"
import { Id } from "react-toastify"
import { useAccount } from "wagmi"
import { showToastAlert } from "../../components/ToastAlert"
import { useAuctionHouseGetAuction, useAuctionHouseStart } from "../../contracts/generated"
import { CHAIN_ID } from "../../lib/settings"

export const AuctionStart = () => {
  const { openConnectModal } = useConnectModal()
  const { isConnected, address } = useAccount()

  const { data: auction, refetch } = useAuctionHouseGetAuction({ chainId: CHAIN_ID })

  const { writeAsync } = useAuctionHouseStart()

  const handleStart = useCallback(async () => {
    let toastId: Id | undefined
    try {
      if (!isConnected) {
        openConnectModal?.()
        return
      }

      if (!writeAsync) return
      const tx = await writeAsync()

      toastId = showToastAlert("loading", "Initializing", "Next auction is about to start...", {
        autoClose: false,
      })
      const receipt = await tx.wait(1)
      if (receipt.status)
        showToastAlert("success", "Success", "Auction is ready", {
          toastId,
          autoClose: 3000,
        })
      else
        showToastAlert("error", "Failed", "Failed to initialize auction", {
          toastId,
          autoClose: 10000,
        })
      refetch()
    } catch (err) {
      console.error("Cannot bid", { err })
      showToastAlert("error", "Error", (err as Error).message, {
        toastId,
        autoClose: 3000,
      })
      refetch()
    }
  }, [isConnected, openConnectModal, refetch, writeAsync])

  if (!auction || !auction.isFinished || !writeAsync) return null

  return (
    <button type="button" className="btn primary" onClick={handleStart}>
      {auction.bidder === address ? "Claim" : "Next"}
    </button>
  )
}
