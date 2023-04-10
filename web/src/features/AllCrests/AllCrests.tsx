import { useQuery } from "@tanstack/react-query"
import { ethers } from "ethers"
import request, { gql } from "graphql-request"
import { useMemo } from "react"
import { Navigate } from "react-router-dom"
import { useAccount } from "wagmi"
import { PolkadotBuilderCrest } from "../../components/PolkadotBuilderCrest"
import { useCrestBalanceOf, useCrestTokenOfOwnerByIndex } from "../../contracts/generated"
import { SQUID_URL } from "../../lib/settings"

type CrestData = {
  id: string
  // uri: string
}

type AllCrestsData = {
  tokens: CrestData[]
}

export const AllCrests = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["all-crests"],
    queryFn: () =>
      request<AllCrestsData>(
        SQUID_URL,
        gql`
          query MyQuery {
            tokens {
              id
            }
          }
        `
      ),
  })

  return (
    <div>
      <div className="flex items-center">
        <div className="grow">
          <h1 className="text-3xl font-bold text-neutral-300">Polkadot Builder Crests</h1>
          <div className="text-neutral-500">Look at these beauties</div>
        </div>
      </div>
      <div className="mt-8 flex w-full flex-wrap gap-4">
        <>
          {isLoading && <>Loading...</>}
          {data?.tokens?.map((token) => (
            <PolkadotBuilderCrest key={token.id} tokenId={token.id} />
          ))}
          {error && <div className="text-red">{(error as any).message}</div>}
        </>
      </div>
    </div>
  )
}
