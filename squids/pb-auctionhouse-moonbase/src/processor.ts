import {EvmBatchProcessor, BatchHandlerContext} from '@subsquid/evm-processor'
import {contract} from './mapping'
import {db, Store} from './db'
import {EntityBuffer} from './entityBuffer'
import {Block, Transaction} from './model'

const processor = new EvmBatchProcessor()
processor.setDataSource({
    archive: 'https://moonbase-evm.archive.subsquid.io',
})
processor.addLog(contract.address, {
    filter: [
        [
            contract.spec.events['Bid'].topic,
            contract.spec.events['OwnershipTransferred'].topic,
            contract.spec.events['Paused'].topic,
            contract.spec.events['Start'].topic,
            contract.spec.events['Unpaused'].topic,
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
        from: 4065903
    },
})
processor.addTransaction(contract.address, {
    sighash: [
        contract.spec.functions['bid'].sighash,
        contract.spec.functions['onERC721Received'].sighash,
        contract.spec.functions['pause'].sighash,
        contract.spec.functions['renounceOwnership'].sighash,
        contract.spec.functions['setDuration'].sighash,
        contract.spec.functions['setExtendedDuration'].sighash,
        contract.spec.functions['setGLMR'].sighash,
        contract.spec.functions['setMinBidIncrementPercent'].sighash,
        contract.spec.functions['setMinFirstBid'].sighash,
        contract.spec.functions['setTreasury'].sighash,
        contract.spec.functions['start'].sighash,
        contract.spec.functions['transferOwnership'].sighash,
        contract.spec.functions['unpause'].sighash,
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

processor.run(db, async (ctx: BatchHandlerContext<Store, any>) => {
    for (let {header: block, items} of ctx.blocks) {
        EntityBuffer.add(
            new Block({
                id: block.id,
                number: block.height,
                timestamp: new Date(block.timestamp),
            })
        )
        let lastTxHash: string | undefined
        for (let item of items) {
            if (item.transaction.hash != lastTxHash) {
                lastTxHash = item.transaction.hash
                EntityBuffer.add(
                    new Transaction({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        hash: item.transaction.hash,
                        to: item.transaction.to,
                        from: item.transaction.from,
                        success: item.transaction.success,
                    })
                )
            }

            if (item.address === contract.address) {
                contract.parse(ctx, block, item)
            }
        }
    }
    for (let entities of EntityBuffer.flush()) {
        await ctx.store.insert(entities)
    }
})
