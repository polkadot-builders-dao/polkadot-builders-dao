import { Store, TypeormDatabase } from "@subsquid/typeorm-store"
import { EvmBatchProcessor } from "@subsquid/evm-processor"
import { lookupArchive } from "@subsquid/archive-registry"
import { events as crestEvents, Contract as CrestContract } from "./abi/Crest"
import { events as auctionHouseEvents } from "./abi/AuctionHouse"
import { Attribute, Bid, Owner, Token, Transfer } from "./model"
import { Block, ChainContext } from "./abi/abi.support"
import {
  ADDRESS_AUCTIONHOUSE,
  ADDRESS_CREST,
  ARCHIVE_NAME,
  RPC_ENDPOINT,
  START_BLOCK,
} from "./settings"
import md5 from "blueimp-md5"
import { broadcastNewAuction } from "./discord/broadcastNewAuction"
import { broadcastNewBid } from "./discord/broadcastNewBid"

const processor = new EvmBatchProcessor()
  .setDataSource({
    // uncomment and set RPC_ENDPOONT to enable contract state queries.
    // Both https and wss endpoints are supported.
    // chain: process.env.RPC_ENDPOINT,

    // Change the Archive endpoints for run the squid
    // against the other EVM networks
    // For a full list of supported networks and config options
    // see https://docs.subsquid.io/develop-a-squid/evm-processor/configuration/

    archive: lookupArchive(ARCHIVE_NAME, { type: "EVM" }),
    chain: RPC_ENDPOINT,
  })
  .setFinalityConfirmation(3)
  .useArchiveOnly(true)
  .setBlockRange({ from: START_BLOCK })
  .addLog({
    address: [ADDRESS_CREST, ADDRESS_AUCTIONHOUSE],
    topic0: [crestEvents.Transfer.topic, auctionHouseEvents.Bid.topic],
    transaction: true,
  })
  .setFields({
    log: {
      data: true,
      topics: true,
    },
    transaction: {
      hash: true,
    },
  })

processor.run(new TypeormDatabase(), async (ctx) => {
  const owners: Record<string, Owner> = {}
  const tokens: Record<string, Token> = {}
  const transfers: Transfer[] = []
  const bids: Bid[] = []
  const attributes: Attribute[] = []

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      if (!log.transaction) {
        throw new Error("log's Transaction is undefined")
      }

      if (log.address === ADDRESS_CREST) {
        for (const topic of log.topics)
          if (topic === crestEvents.Transfer.topic) {
            const { from, to, tokenId } = crestEvents.Transfer.decode(log)

            const oldOwner = await ensureOwner(ctx.store, owners, from)
            const newOwner = await ensureOwner(ctx.store, owners, to)
            const token = await ensureToken(
              ctx,
              block.header,
              ctx.store,
              tokens,
              tokenId.toString(),
              attributes,
              block.header.timestamp
            )

            token.owner = newOwner
            tokens[token.id] = token

            transfers.push(
              new Transfer({
                id: md5(`transfer-${log.transaction.hash}-${tokenId}-${from}-${to}`),
                from: oldOwner,
                to: newOwner,
                token,
                timestamp: BigInt(block.header.timestamp),
                txHash: log.transaction.hash,
                block: block.header.height,
              })
            )
          }
      }

      if (log.address === ADDRESS_AUCTIONHOUSE) {
        for (const topic of log.topics)
          if (topic === auctionHouseEvents.Bid.topic) {
            const { bid: value, bidder, tokenId } = auctionHouseEvents.Bid.decode(log)

            const token = await ensureToken(
              ctx,
              block.header,
              ctx.store,
              tokens,
              tokenId.toString(),
              attributes,
              block.header.timestamp
            )

            const bidItem = new Bid({
              id: md5(`bid-${log.transaction.hash}-${log.id}`),
              bidder,
              token,
              timestamp: BigInt(block.header.timestamp),
              value: value,
              txHash: log.transaction.hash,
            })
            bids.push(bidItem)

            broadcastNewBid(bidItem)
          }
      }

      await ctx.store.save([...Object.values(owners)])
      await ctx.store.save([...Object.values(tokens)])
      await ctx.store.save([...transfers])
      await ctx.store.save([...bids])
      await ctx.store.save([...attributes])
    }
  }
})

const ensureTokenData = async (
  ctx: ChainContext,
  block: Block,
  token: Token,
  attributes: Attribute[]
) => {
  try {
    const tokenId = BigInt(token.id)
    const contract = new CrestContract(ctx, block, ADDRESS_CREST)
    const tokenUri = await contract.tokenURI(tokenId)
    token.dna = await contract.dnaMap(tokenId)

    const base64 = Buffer.from(tokenUri.split(",")[1], "base64").toString("utf-8")
    const json = JSON.parse(base64)

    token.name = json.name
    token.description = json.description
    token.image = json.image
    for (const attr of json.attributes) {
      attributes.push(
        new Attribute({
          id: md5(`attribute-${token.id}-${attr.trait_type}-${attr.value}`),
          token,
          type: attr.trait_type,
          value: attr.value,
        })
      )
    }

    broadcastNewAuction(token, contract)

    return true
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to decode metadata for %s", token.id, err)
    return false
  }
}

const ensureOwner = async (store: Store, owners: Record<string, Owner>, id: string) => {
  let owner = await store.get(Owner, id)
  if (!owner && owners[id]) owner = owners[id]
  if (!owner) {
    owner = new Owner({ id })
    owners[id] = owner
  }
  return owner as Owner
}

const ensureToken = async (
  ctx: ChainContext,
  block: Block,
  store: Store,
  tokens: Record<string, Token>,
  id: string,
  attributes: Attribute[],
  timestamp: number
) => {
  let token = await store.get(Token, id)
  if (!token && tokens[id]) token = tokens[id]
  if (!token) {
    token = new Token({
      id,
      tokenId: BigInt(id),
      timestamp: BigInt(timestamp),
    })
    tokens[id] = token
  }
  if (!token.dna && (await ensureTokenData(ctx, block, token, attributes))) tokens[id] = token

  return token as Token
}
