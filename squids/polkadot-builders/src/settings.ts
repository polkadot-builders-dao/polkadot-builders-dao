/* eslint-disable turbo/no-undeclared-env-vars */

import { KnownArchivesEVM, KnownArchivesSubstrate } from "@subsquid/archive-registry"

if (!process.env.ADDRESS_CREST) throw new Error("ADDRESS_CREST is not defined")
if (!process.env.ADDRESS_AUCTIONHOUSE) throw new Error("ADDRESS_AUCTIONHOUSE is not defined")
if (!process.env.ARCHIVE_NAME) throw new Error("ARCHIVE_NAME is not defined")
if (!process.env.RPC_ENDPOINT) throw new Error("RPC_ENDPOINT is not defined")
if (!process.env.START_BLOCK) throw new Error("START_BLOCK is not defined")

export const ADDRESS_CREST = process.env.ADDRESS_CREST.toLowerCase()
export const ADDRESS_AUCTIONHOUSE = process.env.ADDRESS_AUCTIONHOUSE.toLowerCase()
export const ARCHIVE_NAME = process.env.ARCHIVE_NAME as KnownArchivesEVM
export const RPC_ENDPOINT = process.env.RPC_ENDPOINT
export const START_BLOCK = Number(process.env.START_BLOCK)
