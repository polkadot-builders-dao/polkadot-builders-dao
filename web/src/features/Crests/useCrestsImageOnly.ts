import { useQuery } from "@tanstack/react-query"
import request, { gql } from "graphql-request"
import { SQUID_URL } from "../../lib/settings"

type AllCrestsRawData = {
  tokens: {
    id: string
    image: string
  }[]
}

const getQuery = (address?: string) =>
  address
    ? gql`
        query MyQuery {
          tokens(
            where: { owner: { id_eq: "${address}" } }
            orderBy: tokenId_ASC
          ) {
            id
            image
          }
        }
      `
    : gql`
        query MyQuery {
          tokens(orderBy: tokenId_ASC) {
            id
            image
          }
        }
      `

export const useCrestsImageOnly = (address?: string) => {
  // TODO paginate. can wait until we have 50+ crests
  return useQuery({
    queryKey: ["useAllCrestsImageOnly", address],
    queryFn: () => request<AllCrestsRawData>(SQUID_URL, getQuery(address)),
    select: (data) => data.tokens,
  })
}
