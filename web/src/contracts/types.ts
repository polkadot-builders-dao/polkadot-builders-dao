import { useAuctionHouseGetAuction } from "./generated"

export type AuctionData = NonNullable<ReturnType<typeof useAuctionHouseGetAuction>["data"]>
