import { BigNumberish, ethers } from "ethers"
import { FC, PropsWithChildren } from "react"
import { Drawer } from "../../components/Drawer"
import { useOpenClose } from "../../lib/useOpenClose"
import request, { gql } from "graphql-request"
import { useQuery } from "@tanstack/react-query"
import { useNativeCurrency } from "../../lib/useNativeCurrency"
import { CHAIN_ID, SQUID_URL } from "../../lib/settings"
import { shortenAddress } from "../../lib/shortenAddress"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { useBlockExplorerUrl } from "../../lib/useBlockExplorerUrl"
import { IconExternalLink } from "@tabler/icons-react"

type AuctionHistoryButton = {
  tokenId: BigNumberish
  className?: string
} & PropsWithChildren

type CrestDetailsData = {
  bids: {
    id: string
    bidder: string
    value: string
    timestamp: string
    txHash: string
  }[]
}

type CrestDetailsResponseData = {
  tokenById: CrestDetailsData
}

const AuctionHistory = ({ tokenId }: { tokenId: BigNumberish }) => {
  const currency = useNativeCurrency(CHAIN_ID)

  const { data, error, isLoading } = useQuery({
    queryKey: ["auction-history", tokenId],
    queryFn: () =>
      request<CrestDetailsResponseData>(
        SQUID_URL,
        gql`
          query MyQuery {
            tokenById(id: "${tokenId}") {
              bids(orderBy: timestamp_DESC) {
                bidder
                txHash
                value
                timestamp
                id
              }
            }
          }
        `
      ),
    select: (data) => data.tokenById,
  })

  const blockExplorerUrl = useBlockExplorerUrl(CHAIN_ID)

  if (error)
    return (
      <div className="p-4 text-red-500">
        <p>History could not be fetched :</p>
        <p>{(error as Error).message}</p>
      </div>
    )

  return (
    <div>
      {data?.bids.map((bidEvent) => {
        const date = new Date(Number(bidEvent.timestamp))
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
                  {Number(ethers.utils.formatEther(bidEvent.value)).toFixed(4)} {currency?.symbol}
                </div>
              </div>
              <div className="mt-1 flex items-center text-xs">
                <div className="leading-tight">
                  {date.toLocaleDateString()} {date.toLocaleTimeString()}
                </div>
                <a target="_blank" href={`${blockExplorerUrl}/tx/${bidEvent.txHash}`}>
                  <IconExternalLink className="inline h-4" />
                </a>
              </div>
            </div>
          </div>
        )
      })}
      {data?.bids?.length === 0 && <div className="px-4 py-2">No bid found</div>}
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
        {children ?? (
          <>
            <span className="hidden sm:inline">View bids history</span>
            <span className="inline sm:hidden">Bids history</span>
          </>
        )}
      </button>
      <Drawer title="Auction History" show={isOpen} onDismiss={close} lightDismiss>
        <AuctionHistory tokenId={tokenId} />
      </Drawer>
    </>
  )
}
