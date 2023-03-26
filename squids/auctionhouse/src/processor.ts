import {EvmBatchProcessor, BatchHandlerContext} from '@subsquid/evm-processor'
import {Store, TypeormDatabase} from '@subsquid/typeorm-store'
import {Transaction, Block} from './model'
import {contract} from './mapping'

const processor = new EvmBatchProcessor()
processor.setDataSource({
    archive: 'https://moonbase-evm.archive.subsquid.io',
})
processor.addLog(contract.address, {
    filter: [
        [
            contract.abi.events['Bid'].topic,
            contract.abi.events['OwnershipTransferred'].topic,
            contract.abi.events['Start'].topic,
        ],
    ],
    data: {
        evmLog: {
            topics: true,
            data: true,
        },
        transaction: {
            hash: true,
            from: true,
        },
    } as const,
    range: {
        from: 3782255
    },
})
processor.addTransaction(contract.address, {
    sighash: [
        contract.abi.functions['bid'].sighash,
        contract.abi.functions['onERC721Received'].sighash,
        contract.abi.functions['renounceOwnership'].sighash,
        contract.abi.functions['setDuration'].sighash,
        contract.abi.functions['setExtendedDuration'].sighash,
        contract.abi.functions['setGLMR'].sighash,
        contract.abi.functions['setMinBidIncrementPercent'].sighash,
        contract.abi.functions['setMinFirstBid'].sighash,
        contract.abi.functions['setTreasury'].sighash,
        contract.abi.functions['start'].sighash,
        contract.abi.functions['transferOwnership'].sighash,
    ],
    data: {
        transaction: {
            hash: true,
            input: true,
            from: true,
            value: true,
        },
    } as const,
})

processor.run(new TypeormDatabase(), async (ctx: BatchHandlerContext<Store, any>) => {
    let transactions: Transaction[] = []
    let blocks: Block[] = []
    let other: Record<string, any[]> = {}
    for (let {header: block, items} of ctx.blocks) {
        let b = new Block({
            id: block.id,
            number: block.height,
            timestamp: new Date(block.timestamp),
        })
        blocks.push(b)
        let blockTransactions = new Map<string, Transaction>()
        for (let item of items) {
            let t = blockTransactions.get(item.transaction.id)
            if (t == null) {
                t = new Transaction({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    hash: item.transaction.hash,
                    to: item.transaction.to,
                    from: item.transaction.from,
                })
                blockTransactions.set(t.id, t)
            }

            let addEntity = (e: any) => {
                let a = other[e.constructor.name]
                if (a == null) {
                    a = []
                    other[e.constructor.name] = a
                }
                a.push(e)
            }

            if (item.address === contract.address) {
                let e = contract.parse(ctx, block, item)
                if (e != null) {
                    addEntity(e)
                }
            }
        }
        transactions.push(...blockTransactions.values())
    }
    await ctx.store.save(blocks)
    await ctx.store.save(transactions)
    for (let e in other) {
        await ctx.store.save(other[e])
    }
})
