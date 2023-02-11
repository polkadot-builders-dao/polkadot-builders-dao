import { useCallback } from "react"
import { Button } from "../../components/Button"
import { usePbAuctionHouseGetAuction, usePbAuctionHouseStart } from "../../contracts/generated"
import { useWallet } from "../../lib/useWallet"

export const AuctionStart = () => {
  const { isConnected, connect } = useWallet()
  const { data: auction, error: errorAuction, status } = usePbAuctionHouseGetAuction()

  const { write, data, error } = usePbAuctionHouseStart()

  const handleStart = useCallback(() => {
    write?.()
  }, [write])

  if (!auction || !auction.isFinished) return null

  return isConnected ? (
    <div>
      <Button className="w-[200px]" onClick={handleStart}>
        Next
      </Button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div>{error?.toString()}</div>
    </div>
  ) : (
    <Button className="w-[200px]" onClick={connect}>
      Connect
    </Button>
  )
}
