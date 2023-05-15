import { auctionHouseAddress } from "../contracts/generated"

export const CHAIN_ID = Number(
  import.meta.env.VITE_CHAIN_ID as string
) as keyof typeof auctionHouseAddress

const SQUID_URLS = {
  31337: "http://localhost:4350/graphql",
  1287: "https://squid.subsquid.io/polkadot-builders-moonbase/graphql",
  1284: "https://squid.subsquid.io/polkadot-builders/graphql",
}

export const SQUID_URL = SQUID_URLS[CHAIN_ID]

export const WALLET_CONNECT_PROJECT_IDS = {
  31337: import.meta.env.WALLET_CONNECT_PROJECT_ID_DEV as string,
  1287: "4e05c4b46bbdadf9476c563be1528f30",
  1284: "813f1f168354372b7f3398e4fa259ed9",
}

export const WALLET_CONNECT_PROJECT_ID = WALLET_CONNECT_PROJECT_IDS[CHAIN_ID]
