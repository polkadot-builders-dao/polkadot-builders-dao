import { BigNumberish, ethers } from "ethers"
import { FC, PropsWithChildren } from "react"
import { Drawer } from "../../components/Drawer"
import { useOpenClose } from "../../lib/useOpenClose"
import request, { gql } from "graphql-request"
import { useQuery } from "@tanstack/react-query"
import { useNativeCurrency } from "../../lib/useNativeCurrency"
import { CHAIN_ID } from "../../lib/settings"
import { shortenAddress } from "../../lib/shortenAddress"
import { useEnsAvatar } from "wagmi"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { useBlockExplorerUrl } from "../../lib/useBlockExplorerUrl"
import { IconExternalLink } from "@tabler/icons-react"

type AuctionHistoryButton = {
  tokenId: BigNumberish
  className?: string
} & PropsWithChildren

type BidEvent = {
  id: string
  bid: string
  bidder: string
  block: {
    number: number
    timestamp: string
  }
  transaction: {
    hash: string
  }
}

type AuctionHistoryResults = {
  bidEvents: BidEvent[]
}

const AuctionHistory = ({ tokenId }: { tokenId: BigNumberish }) => {
  console.log("auction history")

  const currency = useNativeCurrency(CHAIN_ID)

  const { data, error } = useQuery({
    queryKey: ["auctionHistory", tokenId],
    queryFn: () =>
      request<AuctionHistoryResults>(
        "http://localhost:4350/graphql",
        gql`
          query MyQuery {
            bidEvents(where: { tokenId_eq: ${tokenId.toString()} }, orderBy: id_DESC) {
              id
              bid
              bidder
              block {
                number
                timestamp
              }
              transaction {
                hash
              }
            }
          }
        `
      ),
  })

  const blockExplorerUrl = useBlockExplorerUrl(CHAIN_ID)

  if (error)
    return (
      <div className="p-4 text-red-500">
        <p>History could not be fetched :</p>
        <p>{(error as Error).message}</p>
      </div>
    )

  console.log("auctionHistory", data)
  return (
    <div>
      {data?.bidEvents.map((bidEvent) => {
        const date = new Date(bidEvent.block.timestamp)
        return (
          <div
            key={bidEvent.id}
            className="flex w-full items-center gap-2 border-b border-neutral-700 px-4 py-2"
          >
            <Jazzicon diameter={36} seed={jsNumberForAddress(bidEvent.bidder)} />
            <div className="grow">
              <div className="flex gap-2">
                <div className="grow"> {shortenAddress(bidEvent.bidder, 4, 4)}</div>
                <div className="text-neutral-300">
                  {Number(ethers.utils.formatEther(bidEvent.bid)).toFixed(4)} {currency?.symbol}
                </div>
              </div>
              <div className="mt-1 flex items-center text-xs">
                <div className="leading-tight">
                  {date.toLocaleDateString()} {date.toLocaleTimeString()}
                </div>
                <a target="_blank" href={`${blockExplorerUrl}/tx/${bidEvent.transaction.hash}`}>
                  <IconExternalLink className="inline h-4" />
                </a>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const AuctionHistoryButton: FC<AuctionHistoryButton> = ({
  tokenId,
  className,
  children,
}) => {
  const { open, close, isOpen } = useOpenClose()

  if (!tokenId) return null

  return (
    <>
      <button type="button" className={className} onClick={open}>
        {children ?? <>View bids history</>}
      </button>
      <Drawer title="Auction History" show={isOpen} onDismiss={close} lightDismiss>
        <AuctionHistory tokenId={tokenId} />
      </Drawer>
    </>
  )
}