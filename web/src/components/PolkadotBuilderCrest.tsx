import classNames from "classnames"
import { ethers } from "ethers"
import { usePBTokenDetails } from "../lib/usePBTokenDetails"

export const PolkadotBuilderCrest = ({
  tokenId,
  withName,
  className,
}: {
  tokenId?: ethers.BigNumberish
  withName?: boolean
  className?: string
}) => {
  const { image, metadata } = usePBTokenDetails(tokenId)

  if (!image || !metadata) return null

  return (
    <div className={className}>
      <img className={classNames("h-[300px] w-[300px] rounded-xl")} src={image} alt="" />
      {withName && <div className="mt-2 text-center">{metadata?.name}</div>}
    </div>
  )
}
