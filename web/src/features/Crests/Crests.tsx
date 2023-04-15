import { FC } from "react"
import { CrestShimmer } from "../../components/Crest/CrestShimmer"
import { CrestWithDetails } from "../../components/Crest/CrestWithDetails"
import { useCrestsImageOnly } from "./useCrestsImageOnly"

export const Crests: FC<{ address?: string }> = ({ address }) => {
  const { data: tokens, error, isLoading } = useCrestsImageOnly(address)

  return (
    <div>
      <div className="flex items-center">
        <div className="grow">
          <h1 className="text-3xl font-bold text-neutral-300">Polkadot Builder Crests</h1>
          <div className="text-neutral-500">Look at these beauties</div>
        </div>
      </div>
      <div className="mt-8">
        <div className="flex w-full flex-wrap gap-4">
          {tokens?.map((token) => (
            <CrestWithDetails key={token.id} token={token} />
          ))}
          {isLoading && (
            <>
              <CrestShimmer />
              <CrestShimmer />
              <CrestShimmer />
            </>
          )}
        </div>
        {!!error && <div className="text-red">{(error as any).message}</div>}
      </div>
    </div>
  )
}
