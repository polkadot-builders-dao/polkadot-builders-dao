import { Store, TypeormDatabase } from "@subsquid/typeorm-store"
import { EvmBatchProcessor } from "@subsquid/evm-processor"
import { lookupArchive } from "@subsquid/archive-registry"
import { events as crestEvents, Contract as CrestContract } from "./abi/crestContract"
import { events as auctionHouseEvents } from "./abi/auctionHouse"
import { Bid, Owner, Token, Transfer } from "./model"
import { BigNumber } from "ethers"
import { Block, ChainContext } from "./abi/abi.support"
import {
  ADDRESS_AUCTIONHOUSE,
  ADDRESS_CREST,
  ARCHIVE_NAME,
  RPC_ENDPOINT,
  START_BLOCK,
} from "./settings"

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
                tokenId.toString()
              )

              token.owner = newOwner
              tokens[token.id] = token

              transfers.push(
                new Transfer({
                  id: `transfer-${item.transaction.hash}-${from}-${to}`,
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
                tokenId.toString()
              )

              const BidItem = new Bid({
                id: `bid-${item.transaction.hash}`,
                bidder,
                token,
                timestamp: BigInt(block.header.timestamp),
                value: BigNumber.from(value).toBigInt(),
                txHash: item.transaction.hash,
              })
              bids.push(BidItem)
            }
      }

      await ctx.store.save([...Object.values(owners)])
      await ctx.store.save([...Object.values(tokens)])
      await ctx.store.save([...transfers])
      await ctx.store.save([...bids])
    }
  }
})

const ensureTokenURI = async (ctx: ChainContext, block: Block, token: Token) => {
  try {
    const contract = new CrestContract(ctx, block, ADDRESS_CREST)
    token.uri = await contract.tokenURI(BigNumber.from(token.id))
    return true
  } catch (err) {
    console.error("Failed to get tokenURI for %s", token.id, err)
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
  id: string
) => {
  let token = await store.get(Token, id)
  if (!token && tokens[id]) token = tokens[id]
  if (!token) {
    token = new Token({ id })
    tokens[id] = token
  }
  if (!token.uri && (await ensureTokenURI(ctx, block, token))) tokens[id] = token

  return token as Token
}
