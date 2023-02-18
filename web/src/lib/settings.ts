import { auctionHouseAddress } from "../contracts/generated"

export const CHAIN_ID = Number(
  import.meta.env.VITE_CHAIN_ID as string
) as keyof typeof auctionHouseAddress
