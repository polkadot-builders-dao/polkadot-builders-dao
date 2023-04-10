import { IconExternalLink } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import classNames from "classnames"
import { ethers } from "ethers"
import request, { gql } from "graphql-request"
import { FC } from "react"
import { jsNumberForAddress } from "react-jazzicon"
import Jazzicon from "react-jazzicon/dist/Jazzicon"
import { CHAIN_ID, SQUID_URL } from "../lib/settings"
import { shortenAddress } from "../lib/shortenAddress"
import { useBlockExplorerUrl } from "../lib/useBlockExplorerUrl"
import { useCrestDetails } from "../lib/useCrestDetails"
import { useNativeCurrency } from "../lib/useNativeCurrency"
import { useOpenClose } from "../lib/useOpenClose"
import { Drawer } from "./Drawer"

type CrestDetailsData = {
  id: string
  owner: { id: string }
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

const CrestDetails: FC<{ tokenId?: ethers.BigNumberish }> = ({ tokenId }) => {
  const currency = useNativeCurrency(CHAIN_ID)
  const blockExplorerUrl = useBlockExplorerUrl(CHAIN_ID)

  const { data, error, isLoading } = useQuery({
    queryKey: ["crest-details", tokenId],
    queryFn: () =>
      request<CrestDetailsResponseData>(
        SQUID_URL,
        gql`
          query MyQuery {
            tokenById(id: "${tokenId}") {
              id
              bids(orderBy: timestamp_DESC) {
                bidder
                txHash
                value
                timestamp
                id
              }
              owner {
                id
              }
            }
          }
        `
      ),
    select: (data) => data.tokenById,
  })

  console.log("CrestDetails", { data, error })

  if (isLoading) return <div>Loading...</div>

  if (error) return <div className="text-red">{(error as any).message}</div>

  if (!data) return null

  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        <div>Owner:</div>
        <a
          target="_blank"
          className="flex items-center gap-2 hover:text-neutral-300"
          href={`${blockExplorerUrl}/address/${data.owner.id}`}
        >
          <Jazzicon
            diameter={20}
            seed={jsNumberForAddress(ethers.utils.getAddress(data.owner.id))}
          />
          <span>{shortenAddress(data.owner.id)}</span>
        </a>
      </div>
      <div>
        {data?.bids?.length ? (
          <div className="mt-8">
            <div>Auction history:</div>
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
                        {Number(ethers.utils.formatEther(bidEvent.value)).toFixed(4)}{" "}
                        {currency?.symbol}
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
          </div>
        ) : null}
      </div>
    </div>
  )
}

export const PolkadotBuilderCrest = ({
  tokenId,
  withName,
  className,
}: {
  tokenId?: ethers.BigNumberish
  withName?: boolean
  className?: string
}) => {
  const { image, metadata } = useCrestDetails(tokenId)
  const { open, close, isOpen } = useOpenClose()

  if (!image || !metadata) return null

  return (
    <>
      <button className={className} onClick={open}>
        <img
          loading="lazy"
          className={classNames("h-[300px] w-[300px] rounded-xl")}
          src={image}
          alt=""
        />
        <div className="mt-2 text-center">{withName ? metadata?.name : `#${tokenId}`}</div>
      </button>
      <Drawer title={`#${tokenId}`} lightDismiss show={isOpen} onDismiss={close}>
        <CrestDetails tokenId={tokenId} />
      </Drawer>
    </>
  )
}
