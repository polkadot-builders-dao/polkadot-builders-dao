import { useQuery } from "@tanstack/react-query"
import request, { gql } from "graphql-request"
import { SQUID_URL } from "../../lib/settings"

type CrestRawData = {
  id: string
  name: string
  description: string
  image: string
  dna: string
  owner: {
    id: string
  }
  transfers: {
    id: string
    timestamp: string
    to: { id: string }
    from: { id: string }
    txHash: string
  }[]
  bids: {
    id: string
    bidder: string
    value: string
    timestamp: string
    txHash: string
  }[]
  attributes: {
    type: string
    value: string
  }[]
  timestamp: string
}

export type CrestViewData = {
  id: string
  name: string
  description: string
  image: string
  dna: string
  owner: string
  transfers: {
    id: string
    timestamp: string
    to: string
    from: string
    txHash: string
  }[]
  bids: {
    id: string
    bidder: string
    value: string
    timestamp: string
    txHash: string
  }[]
  attributes: {
    type: string
    value: string
  }[]
  timestamp: string
}

type CrestsRawDataWrapped = {
  tokenById: CrestRawData | null
}

const getCrestViewDataFromRawData = (raw: CrestRawData | null): CrestViewData | null =>
  raw
    ? {
        id: raw.id,
        name: raw.name,
        description: raw.description,
        image: raw.image,
        dna: raw.dna,
        owner: raw.owner.id,
        bids: raw.bids,
        transfers: raw.transfers.map((xfer) => ({
          id: xfer.id,
          from: xfer.from.id,
          to: xfer.to.id,
          timestamp: xfer.timestamp,
          txHash: xfer.txHash,
        })),
        attributes: raw.attributes,
        timestamp: raw.timestamp,
      }
    : null

export const useCrestDetailsDrawer = (tokenId: string) => {
  return useQuery({
    queryKey: ["crest-details", tokenId],
    queryFn: () =>
      request<CrestsRawDataWrapped>(
        SQUID_URL,
        gql`
          query MyQuery {
            tokenById(id: "${tokenId}") {
              id
              name
              description
              image
              dna
              owner {
                id
              }
              transfers(orderBy: timestamp_DESC) {
                id
                timestamp
                to {
                  id
                }
                from {
                  id
                }
                txHash
              }
              bids(orderBy: timestamp_DESC) {
                id
                bidder
                value
                timestamp
                txHash
              }
              attributes {
                type
                value
              }
              timestamp
            }
          }
        `
      ),
    select: (data) => getCrestViewDataFromRawData(data.tokenById),
    refetchInterval: 10_000,
  })
}
