import { ethers } from "ethers"
import { useMemo } from "react"
import { Navigate } from "react-router-dom"
import { PolkadotBuilderCrest } from "../../components/PolkadotBuilderCrest"
import { useCrestBalanceOf, useCrestTokenOfOwnerByIndex } from "../../contracts/generated"
import { useWallet } from "../../lib/useWallet"

export const CrestOfOwnerByIndex = ({
  address,
  index,
}: {
  address: `0x${string}`
  index: number
}) => {
  const { data: tokenId } = useCrestTokenOfOwnerByIndex({
    args: [address, ethers.BigNumber.from(index)],
  })

  return <PolkadotBuilderCrest tokenId={tokenId} withName />
}

export const MyCrests = () => {
  const { address } = useWallet()
  const { data: balance } = useCrestBalanceOf({
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  const indexes = useMemo(
    () => (balance ? Array.from(Array(balance.toNumber()).keys()) : []),
    [balance]
  )

  if (!address) return <Navigate to="/" />

  return (
    <div>
      <div className="flex items-center">
        <div className="grow">
          <h1 className="text-3xl font-bold text-neutral-300">My Polkadot Builder Crests</h1>
          <div className="text-neutral-500">Look at these beauties</div>
        </div>
      </div>
      <div className="mt-8 flex w-full flex-wrap gap-4">
        {indexes.length ? (
          indexes.map((index) => (
            <CrestOfOwnerByIndex key={index} address={address} index={index} />
          ))
        ) : (
          <>This address doesn't own any crest.</>
        )}
      </div>
    </div>
  )
}
