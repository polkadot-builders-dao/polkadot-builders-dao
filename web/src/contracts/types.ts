import { usePbAuctionHouseGetAuction } from "./generated"

export type AuctionData = NonNullable<ReturnType<typeof usePbAuctionHouseGetAuction>["data"]>
