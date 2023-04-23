import { Store, TypeormDatabase } from "@subsquid/typeorm-store"
import { EvmBatchProcessor, EvmBlock } from "@subsquid/evm-processor"
import { lookupArchive } from "@subsquid/archive-registry"
import { events as crestEvents, Contract as CrestContract } from "./abi/crestContract"
import { events as auctionHouseEvents } from "./abi/auctionHouse"
import { Attribute, Bid, Owner, Token, Transfer } from "./model"
import { BigNumber } from "ethers"
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
  .setBlockRange({ from: START_BLOCK })

  .addLog([ADDRESS_CREST, ADDRESS_AUCTIONHOUSE], {
    filter: [[crestEvents.Transfer.topic, auctionHouseEvents.Bid.topic]],
    data: {
      evmLog: {
        topics: true,
        data: true,
      },
      transaction: {
        hash: true,
      },
    } as const,
  })

processor.run(new TypeormDatabase(), async (ctx) => {
  const owners: Record<string, Owner> = {}
  const tokens: Record<string, Token> = {}
  const transfers: Transfer[] = []
  const bids: Bid[] = []
  const attributes: Attribute[] = []

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.address === ADDRESS_CREST) {
        if (item.kind === "evmLog") {
          for (const topic of item.evmLog.topics)
            if (topic === crestEvents.Transfer.topic) {
              const { from, to, tokenId } = crestEvents.Transfer.decode(item.evmLog)

              const oldOwner = await ensureOwner(ctx.store, owners, from)
              const newOwner = await ensureOwner(ctx.store, owners, to)
              const token = await ensureToken(
                ctx,
                block.header,
                ctx.store,
                tokens,
                tokenId.toString(),
                attributes
              )

              token.owner = newOwner
              tokens[token.id] = token

              transfers.push(
                new Transfer({
                  id: md5(`transfer-${item.transaction.hash}-${tokenId}-${from}-${to}`),
                  from: oldOwner,
                  to: newOwner,
                  token,
                  timestamp: BigInt(block.header.timestamp),
                  txHash: item.transaction.hash,
                  block: block.header.height,
                })
              )
            }
        }
      }

      if (item.address === ADDRESS_AUCTIONHOUSE) {
        if (item.kind === "evmLog")
          for (const topic of item.evmLog.topics)
            if (topic === auctionHouseEvents.Bid.topic) {
              const { bid: value, bidder, tokenId } = auctionHouseEvents.Bid.decode(item.evmLog)

              const token = await ensureToken(
                ctx,
                block.header,
                ctx.store,
                tokens,
                tokenId.toString(),
                attributes
              )

              const bidItem = new Bid({
                id: md5(`bid-${item.transaction.hash}-${item.evmLog.id}`),
                bidder,
                token,
                timestamp: BigInt(block.header.timestamp),
                value: value.toBigInt(),
                txHash: item.transaction.hash,
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
    const tokenId = BigNumber.from(token.id)
    const contract = new CrestContract(ctx, block, ADDRESS_CREST)
    const tokenUri = await contract.tokenURI(tokenId)
    token.dna = (await contract.dnaMap(tokenId)).toBigInt()

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

    broadcastNewAuction(token)

    return true
  } catch (err) {
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
  block: EvmBlock,
  store: Store,
  tokens: Record<string, Token>,
  id: string,
  attributes: Attribute[]
) => {
  let token = await store.get(Token, id)
  if (!token && tokens[id]) token = tokens[id]
  if (!token) {
    token = new Token({
      id,
      tokenId: BigInt(id),
      timestamp: BigInt(block.timestamp),
    })
    tokens[id] = token
  }
  if (!token.dna && (await ensureTokenData(ctx, block, token, attributes))) tokens[id] = token

  return token as Token
}
