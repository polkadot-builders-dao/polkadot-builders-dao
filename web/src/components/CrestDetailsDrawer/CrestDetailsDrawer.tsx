import { IconExternalLink, IconHistory } from "@tabler/icons-react"
import { ethers } from "ethers"
import { FC } from "react"
import { CHAIN_ID } from "../../lib/settings"
import { shortenAddress } from "../../lib/shortenAddress"
import { useBlockExplorerUrl } from "../../lib/useBlockExplorerUrl"
import { useNativeCurrency } from "../../lib/useNativeCurrency"
import { Avatar } from "../Avatar"
import { Drawer } from "../Drawer"
import { useCrestDetailsDrawer } from "./useCrestDetailsDrawer"

const CrestDetails: FC<{ tokenId: string }> = ({ tokenId }) => {
  const currency = useNativeCurrency(CHAIN_ID)
  const blockExplorerUrl = useBlockExplorerUrl(CHAIN_ID)

  const { data: token, isLoading, error } = useCrestDetailsDrawer(tokenId)

  console.log("CrestDetails", { token, error })

  if (error) return <div className="text-red p-4">{(error as any).message}</div>

  if (isLoading)
    return (
      <div className="p-4">
        <div className="aspect-square w-full animate-pulse rounded-xl bg-neutral-900"></div>
      </div>
    )

  if (!token)
    return (
      <div className="p-4">
        <div className="aspect-square w-full animate-pulse rounded-xl bg-neutral-900"></div>
        <div className="mt-4">Crest data isn't available yet, please wait.</div>
      </div>
    )

  return (
    <div className="p-4">
      <div className="text-center">
        <img src={token.image} alt="" className="aspect-square w-full rounded-xl" />
      </div>
      <div className="mt-4">
        <div className="space-y-1">
          {token.attributes.map(({ type, value }, i) => (
            <div key={i} className="flex w-full items-center justify-between">
              <div>{type.replace("Quadrant ", "")}</div>
              <div className="rounded bg-neutral-900 px-2 py-1 text-sm text-neutral-500">
                {value}
              </div>
            </div>
          ))}
          <div className="flex w-full items-center justify-between">
            <div>Owned by</div>
            <a
              target="_blank"
              className="flex items-center gap-2 hover:text-neutral-300"
              href={`${blockExplorerUrl}/address/${token.owner}`}
            >
              <Avatar size={20} address={token.owner} />
              <span>{shortenAddress(token.owner)}</span>
            </a>
          </div>
          <div className="flex w-full items-center justify-between">
            <div>Created on</div>
            <div>{new Date(Number(token.timestamp)).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div>
        {token?.bids?.length ? (
          <div className="mt-8">
            <div className="flex items-center gap-1 font-semibold text-neutral-300">
              <IconHistory className="inline" />
              <span className="text-lg">History</span>
            </div>
            {token?.bids.map((bidEvent) => {
              const date = new Date(Number(bidEvent.timestamp))
              return (
                <div
                  key={bidEvent.id}
                  className="flex w-full items-center gap-2 border-b border-neutral-700 px-4 py-2"
                >
                  <Avatar size={36} address={bidEvent.bidder} />
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

export const CrestDetailsDrawer = ({
  tokenId,
  show,
  onDismiss,
}: {
  tokenId: string
  show?: boolean
  onDismiss?: () => void
}) => {
  return (
    <Drawer title={`Crest #${tokenId}`} lightDismiss show={show} onDismiss={onDismiss}>
      <CrestDetails tokenId={tokenId} />
    </Drawer>
  )
}
