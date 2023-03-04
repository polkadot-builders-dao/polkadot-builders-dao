import { BigNumber } from "ethers"
import { formatEther } from "ethers/lib/utils.js"
import { useAuctionHouseGetAuction, useAuctionHouseGetConfig } from "../../contracts/generated"
import { shortenAddress } from "../../lib/shortenAddress"

import { useWallet } from "../../lib/useWallet"
import { AuctionStart } from "./AuctionStart"
import { BidInput } from "./BidInput"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { CHAIN_ID } from "../../lib/settings"
import { Countdown } from "../../components/Countdown"
import { AuctionData } from "../../contracts/types"
import { useEffect, useMemo, useState } from "react"
import { useNativeCurrency } from "../../lib/useNativeCurrency"
import { useCrestDetails } from "../../lib/useCrestDetails"
import { AuctionHistoryButton } from "./AuctionHistoryButton"
import Jazzicon from "react-jazzicon/dist/Jazzicon"
import { jsNumberForAddress } from "react-jazzicon"

const displayBigNumberAsDate = (date?: BigNumber, distanceToNow = false) => {
  if (!date) return null

  const dt = new Date(date.toNumber() * 1000)

  if (distanceToNow) return formatDistanceToNow(dt, { includeSeconds: true, addSuffix: true })

  return `${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`
}

const AuctionDetails = ({ auction }: { auction: AuctionData }) => {
  const { address } = useWallet()
  const currency = useNativeCurrency(CHAIN_ID)
  const auctionDate = useMemo(
    () => new Date(auction.startTime.toNumber() * 1000).toLocaleDateString(),
    [auction.startTime]
  )
  const dateEnd = useMemo(() => new Date(auction.endTime.toNumber() * 1000), [auction.endTime])
  const currentBid = useMemo(
    () => Number(formatEther(auction.currentBid)).toFixed(2),
    [auction.currentBid]
  )

  console.log(auction)

  return (
    <div className="flex h-full flex-col">
      <div className="text-neutral-500">{auctionDate}</div>
      <h1 className="text-3xl font-bold text-neutral-300">
        Polkadot Builder #{auction.tokenId.toNumber()}
      </h1>
      {auction.isFinished ? (
        <div className="mt-8">
          <div>Auction has ended.</div>
        </div>
      ) : (
        <div className="mt-8 flex gap-8">
          <div>
            <div className="text-neutral-500">Current bid</div>
            <div className="text-xl">
              {currentBid} {currency?.symbol}
            </div>
          </div>
          <div className="my-1 border-r border-current opacity-50"></div>
          <div>
            <div className="text-neutral-500">Auction ends in</div>
            <div className="text-xl ">{<Countdown date={dateEnd} />}</div>
          </div>
        </div>
      )}
      <div className="flex grow items-center">
        <BidInput />
      </div>
      <div>
        {auction.currentBid?.gt(0) ? (
          <div>
            <div className="flex w-full items-center ">
              <div className="grow text-neutral-500">
                {auction.isFinished ? "Winner" : "Latest bid"}
              </div>
              <AuctionHistoryButton
                className="text-polkadot-400 hover:text-polkadot-300 font-light"
                tokenId={auction.tokenId}
              />
            </div>
            <div className="flex w-full justify-between text-lg">
              <div className="flex items-center gap-1">
                <Jazzicon seed={jsNumberForAddress(auction.bidder)} />
                {shortenAddress(auction.bidder, 4, 4)}{" "}
                {/* {auction.bidder === address ? (
                  <span className="text-polkadot-500">(you)</span>
                ) : null} */}
              </div>
              <div className="text-neutral-200">
                {currentBid} {currency?.symbol}
              </div>
            </div>
          </div>
        ) : (
          <div>No one has bid.</div>
        )}
      </div>
    </div>
  )
}

export const Auction = () => {
  const { isConnected } = useWallet()

  const { data: config } = useAuctionHouseGetConfig({
    chainId: CHAIN_ID,
  })

  const [watch, setWatch] = useState(true)
  const { data: auction } = useAuctionHouseGetAuction({
    chainId: CHAIN_ID,
    watch,
  })

  useEffect(() => {
    console.log({ auction })
  }, [auction])

  useEffect(() => {
    console.log({ config })
  }, [config])

  const { image, metadata } = useCrestDetails(auction?.tokenId)

  return (
    <div>
      <div className="flex items-center">
        <div className="grow">
          <h1 className="text-3xl font-bold text-neutral-300">Current auction</h1>
          <div className="text-neutral-500">Place your bid, fren!</div>
        </div>
        <AuctionStart />
      </div>
      {!!auction && !!image && !!metadata && (
        <div>
          <div className="my-8 flex w-full justify-evenly gap-12">
            <div className="h-[300px] w-[300px] shrink-0 rounded-xl bg-slate-500 text-center">
              {image && <img className="h-[300px] w-[300px] rounded-xl" src={image} alt="" />}
            </div>
            <div>
              <AuctionDetails auction={auction} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
