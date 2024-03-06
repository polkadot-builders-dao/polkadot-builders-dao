import { useAddRecentTransaction, useConnectModal } from "@rainbow-me/rainbowkit"
import { FC, useCallback } from "react"
import { Id } from "react-toastify"
import { useAccount } from "wagmi"
import { showToastAlert } from "../../components/ToastAlert"
import { useAuctionHouseStart } from "../../contracts/generated"
import { CHAIN_ID } from "../../lib/settings"
import { waitForTransaction } from "wagmi/actions"
import { AuctionData } from "../../contracts/types"

export const AuctionStart: FC<{ auction: AuctionData; refetchAuction: () => void }> = ({
  auction,
  refetchAuction,
}) => {
  const addRecentTransaction = useAddRecentTransaction()
  const { openConnectModal } = useConnectModal()
  const { isConnected, address } = useAccount()

  const { writeAsync } = useAuctionHouseStart()

  const handleStart = useCallback(async () => {
    let toastId: Id | undefined
    try {
      if (!isConnected) {
        openConnectModal?.()
        return
      }

      if (!writeAsync) return
      const { hash } = await writeAsync()
      addRecentTransaction({
        hash,
        description: `Settle auction #${auction.tokenId}`,
      })

      toastId = showToastAlert("loading", "Initializing", "Next auction is about to start...", {
        autoClose: false,
      })

      const receipt = await waitForTransaction({
        chainId: CHAIN_ID,
        hash,
      })
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
      refetchAuction()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Cannot bid", { err })
      showToastAlert("error", "Error", (err as Error).message, {
        toastId,
        autoClose: 3000,
      })
      refetchAuction()
    }
  }, [
    addRecentTransaction,
    auction.tokenId,
    isConnected,
    openConnectModal,
    refetchAuction,
    writeAsync,
  ])

  if (!auction || !auction.isFinished || !writeAsync) return null

  return (
    <button
      type="button"
      disabled
      title="So Long, and Thanks for All the Fish"
      className="btn primary"
      onClick={handleStart}
    >
      {auction.bidder === address ? "Claim" : "Next"}
    </button>
  )
}
