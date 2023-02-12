import { useCallback } from "react"
import { Button } from "../../components/Button"
import { usePbAuctionHouseGetAuction, usePbAuctionHouseStart } from "../../contracts/generated"
import { useWallet } from "../../lib/useWallet"

export const AuctionStart = () => {
  const { isConnected, connect, address } = useWallet()
  const { data: auction, error: errorAuction, status } = usePbAuctionHouseGetAuction()

  const { write, writeAsync, data, error } = usePbAuctionHouseStart()

  const handleStart = useCallback(() => {
    write?.()
  }, [write])

  if (!auction || !auction.isFinished) return null

  return isConnected ? (
    <Button className="" onClick={handleStart}>
      {auction.bidder === address ? "Claim" : "Next"}
    </Button>
  ) : (
    <Button className="" onClick={connect}>
      Connect
    </Button>
  )
}
