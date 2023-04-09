import { ReadContractResult } from "wagmi/dist/actions"
import { auctionHouseABI } from "./generated"

export type AuctionData = ReadContractResult<typeof auctionHouseABI, "getAuction">
