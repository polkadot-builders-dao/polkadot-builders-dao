import { useAuctionHouseGetAuction } from "../../contracts/generated"
import { shortenAddress } from "../../lib/shortenAddress"

import { AuctionStart } from "./AuctionStart"
import { BidInput } from "./BidInput"
import { CHAIN_ID } from "../../lib/settings"
import { Countdown } from "../../components/Countdown"
import { AuctionData } from "../../contracts/types"
import { FC, useEffect, useMemo, useState } from "react"
import { useCrestFromChain } from "../../lib/useCrestFromChain"
import { AuctionHistoryButton } from "./AuctionHistoryButton"
import { LayoutBackground } from "../../components/Layout/LayoutBackground"
import { useOpenClose } from "../../lib/useOpenClose"
import { CrestDetailsDrawer } from "../../components/CrestDetailsDrawer/CrestDetailsDrawer"
import { EthValue } from "../../components/EthValue"
import { Avatar } from "../../components/Avatar"

const AuctionDetails: FC<{ auction: AuctionData; refetchAuction: () => void }> = ({
  auction,
  refetchAuction,
}) => {
  const auctionDate = useMemo(
    () => new Date(Number(auction.startTime) * 1000).toLocaleDateString(),
    [auction.startTime]
  )
  const dateEnd = useMemo(() => new Date(Number(auction.endTime) * 1000), [auction.endTime])

  return (
    <div className="flex min-h-[300px] w-full max-w-[500px] flex-col rounded-xl bg-neutral-950/40 p-4">
      <div className="text-neutral-500">{auctionDate}</div>
      <h1 className="text-3xl font-bold text-neutral-300">
        Polkadot Builder #{Number(auction.tokenId)}
      </h1>
      {auction.isFinished ? (
        <div className="mt-8">
          <div>Auction has ended.</div>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:gap-8 ">
          <div>
            <div className="text-neutral-500">Current bid</div>
            <div className="text-xl">
              <EthValue wei={auction.currentBid} />
            </div>
          </div>
          <div className="my-1 hidden border-r border-current opacity-50 sm:block"></div>
          <div>
            <div className="text-neutral-500">Auction ends in</div>
            <div className="text-xl ">{<Countdown date={dateEnd} />}</div>
          </div>
        </div>
      )}
      <div className="my-4 grow items-center">
        <BidInput auction={auction} refetchAuction={refetchAuction} />
      </div>
      <div>
        {auction.currentBid ? (
          <div className="text-sm sm:text-base">
            <div className="flex w-full items-center ">
              <div className="grow text-neutral-500">
                {auction.isFinished ? "Winner" : "Latest bid"}
              </div>
              <AuctionHistoryButton
                className="text-polkadot-400 hover:text-polkadot-300 font-light"
                tokenId={auction.tokenId?.toString()}
              />
            </div>
            <div className="flex w-full justify-between sm:text-lg">
              <div className="flex items-center gap-1">
                <span className="inline-block sm:hidden">
                  <Avatar size={12} address={auction.bidder} />
                </span>
                <span className="hidden sm:inline-block">
                  <Avatar size={16} address={auction.bidder} />
                </span>
                <span>{shortenAddress(auction.bidder, 4, 4)}</span>
              </div>
              <div className="text-neutral-200">
                <EthValue wei={auction.currentBid} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export const Auction = () => {
  const { data: auction, refetch } = useAuctionHouseGetAuction({
    chainId: CHAIN_ID,
    watch: true,
  })

  const { image, metadata } = useCrestFromChain(auction?.tokenId)
  const { open, close, isOpen } = useOpenClose()

  // keep prev value until all data is fetched for the new auction
  // this allows for smooth UI transition
  const [auctionData, setAuctionData] = useState<{
    auction: NonNullable<typeof auction>
    image: NonNullable<typeof image>
    metadata: NonNullable<typeof metadata>
  }>()
  useEffect(() => {
    if (auction && image && metadata) setAuctionData({ auction, image, metadata })
  }, [auction, image, metadata])

  return (
    <div>
      <div>
        <div className="grid min-h-[300px] w-full grid-cols-1 justify-evenly gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col items-center justify-center">
            {auctionData ? (
              <button onClick={open}>
                <img
                  className="inline-block aspect-square w-full max-w-[300px] rounded-xl lg:max-w-[400px]"
                  src={auctionData.image}
                  alt=""
                />
              </button>
            ) : (
              <div className="inline-block aspect-square w-full max-w-[300px] animate-pulse rounded-xl bg-neutral-900 lg:max-w-[400px]"></div>
            )}
          </div>
          <div className="lg-col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            {auctionData ? (
              <AuctionDetails auction={auctionData.auction} refetchAuction={refetch} />
            ) : (
              <div className="flex min-h-[300px] w-full max-w-[500px] animate-pulse flex-col rounded-xl bg-neutral-900 p-4"></div>
            )}
          </div>
        </div>
        <div className="flex h-24 items-center justify-center md:justify-end">
          {!!auctionData && <AuctionStart auction={auctionData.auction} refetchAuction={refetch} />}
        </div>
      </div>

      {auctionData && <LayoutBackground metadata={auctionData.metadata} />}
      {!!auction?.tokenId && (
        <CrestDetailsDrawer tokenId={auction.tokenId.toString()} onDismiss={close} show={isOpen} />
      )}
    </div>
  )
}
