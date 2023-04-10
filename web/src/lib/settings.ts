import { auctionHouseAddress } from "../contracts/generated"

export const CHAIN_ID = Number(
  import.meta.env.VITE_CHAIN_ID as string
) as keyof typeof auctionHouseAddress

const SQUID_URLS = {
  31337: "http://localhost:4350/graphql",
  1287: "https://squid.subsquid.io/polkadot-builders-moonbase/v/v1/graphql",
  1284: "https://squid.subsquid.io/polkadot-builders/v/v1/graphql",
}

export const SQUID_URL = SQUID_URLS[CHAIN_ID]
