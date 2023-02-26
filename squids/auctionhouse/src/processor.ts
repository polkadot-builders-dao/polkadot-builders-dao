import * as abi from './abi/AuctionHouse'
import {EvmBatchProcessor, BatchProcessorItem, BatchProcessorLogItem, BatchHandlerContext, BatchProcessorTransactionItem, EvmBlock} from '@subsquid/evm-processor'
import {Store, TypeormDatabase} from '@subsquid/typeorm-store'
import {Transaction, Block, BidEvent, OwnershipTransferredEvent, StartEvent, BidFunction, OnErc721ReceivedFunction, RenounceOwnershipFunction, SetDurationFunction, SetExtendedDurationFunction, SetMinBidIncrementPercentFunction, SetMinFirstBidFunction, SetTreasuryFunction, StartFunction, TransferOwnershipFunction} from './model'
import {normalize} from './util'

const CONTRACT_ADDRESS = '0xc6ff4cc65c48c7213d097254c5c6c586609e86df'

const processor = new EvmBatchProcessor()
    .setDataSource({
        archive: 'https://moonbase-evm.archive.subsquid.io',
    })
    .setBlockRange({
        from: 3782255
    })
    .addLog(CONTRACT_ADDRESS, {
        filter: [
            [
                abi.events['Bid'].topic,
                abi.events['OwnershipTransferred'].topic,
                abi.events['Start'].topic,
            ],
        ],
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
    .addTransaction(CONTRACT_ADDRESS, {
        sighash: [
            abi.functions['bid'].sighash,
            abi.functions['onERC721Received'].sighash,
            abi.functions['renounceOwnership'].sighash,
            abi.functions['setDuration'].sighash,
            abi.functions['setExtendedDuration'].sighash,
            abi.functions['setMinBidIncrementPercent'].sighash,
            abi.functions['setMinFirstBid'].sighash,
            abi.functions['setTreasury'].sighash,
            abi.functions['start'].sighash,
            abi.functions['transferOwnership'].sighash,
        ],
        data: {
            transaction: {
                hash: true,
                input: true,
            },
        } as const,
    })

type SquidEventEntity = BidEvent | OwnershipTransferredEvent | StartEvent
type SquidFunctionEntity = BidFunction | OnErc721ReceivedFunction | RenounceOwnershipFunction | SetDurationFunction | SetExtendedDurationFunction | SetMinBidIncrementPercentFunction | SetMinFirstBidFunction | SetTreasuryFunction | StartFunction | TransferOwnershipFunction
type SquidEntity = SquidEventEntity | SquidFunctionEntity

processor.run(new TypeormDatabase(), async (ctx) => {
    let events: Record<string, SquidEventEntity[]> = {}
    let functions: Record<string, SquidFunctionEntity[]> = {}
    let transactions: Transaction[] = []
    let blocks: Block[] = []
    for (let {header: block, items} of ctx.blocks) {
        let b = new Block({
            id: block.id,
            number: block.height,
            timestamp: new Date(block.timestamp),
        })
        let blockTransactions = new Map<string, Transaction>()
        for (let item of items) {
            if (item.address !== CONTRACT_ADDRESS) continue
            let it: SquidEntity | undefined
            switch (item.kind) {
                case 'evmLog':
                    let e = it = parseEvmLog(ctx, block, item)
                    if (e) {
                        if (events[e.name] == null) events[e.name] = []
                        events[e.name].push(e)
                    }
                    break
                case 'transaction':
                    let f = it = parseTransaction(ctx, block, item)
                    if (f) {
                        if (functions[f.name] == null) functions[f.name] = []
                        functions[f.name].push(f)
                    }
                    break
                default:
                    continue
            }
            if (it) {
                let t = blockTransactions.get(item.transaction.id)
                if (!t) {
                    t = new Transaction({
                        id: item.transaction.id,
                        hash: item.transaction.hash,
                        contract: item.transaction.to,
                        block: b,
                    })
                    blockTransactions.set(t.id, t)
                }
                it.transaction = t
                it.block = b
            }
        }
        if (blockTransactions.size > 0) {
            blocks.push(b)
            transactions.push(...blockTransactions.values())
        }
    }
    await ctx.store.save(blocks)
    await ctx.store.save(transactions)
    for (let f in functions) {
        await ctx.store.save(functions[f])
    }
    for (let e in events) {
        await ctx.store.save(events[e])
    }
})

type Item = BatchProcessorItem<typeof processor>
type Context = BatchHandlerContext<Store, Item>

function parseEvmLog(ctx: Context, block: EvmBlock, item: BatchProcessorLogItem<typeof processor>): SquidEventEntity | undefined {
    try {
        switch (item.evmLog.topics[0]) {
            case abi.events['Bid'].topic: {
                let e = normalize(abi.events['Bid'].decode(item.evmLog))
                return new BidEvent({
                    id: item.evmLog.id,
                    name: 'Bid',
                    tokenId: e[0],
                    bidder: e[1],
                    bid: e[2],
                })
            }
            case abi.events['OwnershipTransferred'].topic: {
                let e = normalize(abi.events['OwnershipTransferred'].decode(item.evmLog))
                return new OwnershipTransferredEvent({
                    id: item.evmLog.id,
                    name: 'OwnershipTransferred',
                    previousOwner: e[0],
                    newOwner: e[1],
                })
            }
            case abi.events['Start'].topic: {
                let e = normalize(abi.events['Start'].decode(item.evmLog))
                return new StartEvent({
                    id: item.evmLog.id,
                    name: 'Start',
                    tokenId: e[0],
                })
            }
        }
    } catch (error) {
        ctx.log.error({error, blockNumber: block.height, blockHash: block.hash}, `Unable to decode event "${item.evmLog.topics[0]}"`)
    }
}

function parseTransaction(ctx: Context, block: EvmBlock, item: BatchProcessorTransactionItem<typeof processor>): SquidFunctionEntity | undefined  {
    try {
        switch (item.transaction.input.slice(0, 10)) {
            case abi.functions['bid'].sighash: {
                return new BidFunction({
                    id: item.transaction.id,
                    name: 'bid',
                })
            }
            case abi.functions['onERC721Received'].sighash: {
                let f = normalize(abi.functions['onERC721Received'].decode(item.transaction.input))
                return new OnErc721ReceivedFunction({
                    id: item.transaction.id,
                    name: 'onERC721Received',
                    arg0: f[0],
                    arg1: f[1],
                    arg2: f[2],
                    arg3: f[3],
                })
            }
            case abi.functions['renounceOwnership'].sighash: {
                return new RenounceOwnershipFunction({
                    id: item.transaction.id,
                    name: 'renounceOwnership',
                })
            }
            case abi.functions['setDuration'].sighash: {
                let f = normalize(abi.functions['setDuration'].decode(item.transaction.input))
                return new SetDurationFunction({
                    id: item.transaction.id,
                    name: 'setDuration',
                    duration: f[0],
                })
            }
            case abi.functions['setExtendedDuration'].sighash: {
                let f = normalize(abi.functions['setExtendedDuration'].decode(item.transaction.input))
                return new SetExtendedDurationFunction({
                    id: item.transaction.id,
                    name: 'setExtendedDuration',
                    extendedDuration: f[0],
                })
            }
            case abi.functions['setMinBidIncrementPercent'].sighash: {
                let f = normalize(abi.functions['setMinBidIncrementPercent'].decode(item.transaction.input))
                return new SetMinBidIncrementPercentFunction({
                    id: item.transaction.id,
                    name: 'setMinBidIncrementPercent',
                    minBidIncrementPercent: f[0],
                })
            }
            case abi.functions['setMinFirstBid'].sighash: {
                let f = normalize(abi.functions['setMinFirstBid'].decode(item.transaction.input))
                return new SetMinFirstBidFunction({
                    id: item.transaction.id,
                    name: 'setMinFirstBid',
                    minFirstBid: f[0],
                })
            }
            case abi.functions['setTreasury'].sighash: {
                let f = normalize(abi.functions['setTreasury'].decode(item.transaction.input))
                return new SetTreasuryFunction({
                    id: item.transaction.id,
                    name: 'setTreasury',
                    treasury: f[0],
                })
            }
            case abi.functions['start'].sighash: {
                return new StartFunction({
                    id: item.transaction.id,
                    name: 'start',
                })
            }
            case abi.functions['transferOwnership'].sighash: {
                let f = normalize(abi.functions['transferOwnership'].decode(item.transaction.input))
                return new TransferOwnershipFunction({
                    id: item.transaction.id,
                    name: 'transferOwnership',
                    newOwner: f[0],
                })
            }
        }
    } catch (error) {
        ctx.log.error({error, blockNumber: block.height, blockHash: block.hash}, `Unable to decode function "${item.transaction.input.slice(0, 10)}"`)
    }
}
