import { auctionHouseAddress } from "../contracts/generated"

export const CHAIN_ID = Number(
  import.meta.env.VITE_CHAIN_ID as string
) as keyof typeof auctionHouseAddress

const SQUID_URLS_AUCTIONHOUSE = {
  31337: "http://localhost:4350/graphql",
  1287: "https://squid.subsquid.io/pb-auctionhouse-moonbase/v/v1/graphql",
  1284: "TODO",
}

export const SQUID_URL_AUCTIONHOUSE = SQUID_URLS_AUCTIONHOUSE[CHAIN_ID]
