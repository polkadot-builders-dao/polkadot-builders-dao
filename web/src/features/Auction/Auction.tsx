import { BigNumber } from "ethers"
import { formatEther } from "ethers/lib/utils.js"
import { usePbAuctionHouseGetAuction } from "../../contracts/generated"
import { shortenAddress } from "../../lib/shortenAddress"
import { usePBTokenDetails } from "../../lib/usePBTokenDetails"
import { useWallet } from "../../lib/useWallet"
import { AuctionStart } from "./AuctionStart"
import { BidInput } from "./BidInput"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { CHAIN_ID } from "../../lib/settings"

const displayBigNumberAsDate = (date?: BigNumber, distanceToNow = false) => {
  if (!date) return null

  const dt = new Date(date.toNumber() * 1000)

  if (distanceToNow) return formatDistanceToNow(dt, { includeSeconds: true, addSuffix: true })

  return `${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`
}

export const Auction = () => {
  const { isConnected, connect } = useWallet()

  const {
    data: auction,
    error: errorAuction,
    status,
  } = usePbAuctionHouseGetAuction({
    watch: true,
    chainId: CHAIN_ID,
    enabled: true,
  })

  const { image, metadata } = usePBTokenDetails(auction?.tokenId)

  return (
    <div>
      <div className="flex items-center">
        <div className="grow">
          <h1 className="text-3xl font-bold text-neutral-300">Current auction</h1>
          <div className="text-neutral-500">{metadata?.name}</div>
        </div>
        {isConnected && <AuctionStart />}
      </div>
      {!!auction && !!image && !!metadata && (
        <div>
          <div className="my-8 flex gap-4">
            <div className="h-[300px] w-[300px] shrink-0 rounded-xl bg-slate-500">
              {image && <img className="h-[300px] w-[300px] rounded-xl" src={image} alt="" />}
            </div>
            <div className="">
              <div className="flex h-full flex-col">
                <div></div>
                <div>Start : {displayBigNumberAsDate(auction?.startTime)}</div>
                {auction?.isFinished ? (
                  <div>Ended</div>
                ) : (
                  <div>End : {displayBigNumberAsDate(auction?.endTime, true)}</div>
                )}
                <div className="h-[1em]"></div>
                {auction?.currentBid?.gt(0) ? (
                  <>
                    <div>
                      Current bid :{" "}
                      {auction.currentBid ? formatEther(auction.currentBid) : auction.currentBid}{" "}
                      ETH
                    </div>
                    <div>
                      Current bidder : {auction.bidder ? shortenAddress(auction.bidder) : null}
                    </div>
                  </>
                ) : (
                  <div>
                    No bids yet, this NFT will be burned at the end of the auction if noone bids.
                  </div>
                )}
                {!!auction?.isFinished && (
                  <div className="flex grow flex-col justify-center">
                    Auction has ended, anyone may start the next one by clicking the button below.
                  </div>
                )}
              </div>
            </div>
          </div>
          {isConnected && <BidInput />}
        </div>
      )}
    </div>
  )
}
