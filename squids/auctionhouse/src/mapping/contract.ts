import {CommonHandlerContext, EvmBlock} from '@subsquid/evm-processor'
import {LogItem, TransactionItem} from '@subsquid/evm-processor/lib/interfaces/dataSelection'
import * as abi from '../abi/AuctionHouse'
import {ContractEventBid, ContractEventOwnershipTransferred, ContractEventStart, ContractFunctionBid, ContractFunctionOnErc721Received, ContractFunctionRenounceOwnership, ContractFunctionSetDuration, ContractFunctionSetExtendedDuration, ContractFunctionSetGlmr, ContractFunctionSetMinBidIncrementPercent, ContractFunctionSetMinFirstBid, ContractFunctionSetTreasury, ContractFunctionStart, ContractFunctionTransferOwnership} from '../model'
import {normalize} from '../util'

export {abi}

export const address = '0xc6ff4cc65c48c7213d097254c5c6c586609e86df'

type EventItem = LogItem<{evmLog: {topics: true, data: true}, transaction: {hash: true}}>
type FunctionItem = TransactionItem<{transaction: {hash: true, input: true, value: true}}>

export function parse(ctx: CommonHandlerContext<unknown>, block: EvmBlock, item: EventItem | FunctionItem) {
    switch (item.kind) {
        case 'evmLog':
            return parseEvent(ctx, block, item)
        case 'transaction':
            return parseFunction(ctx, block, item)
    }
}

function parseEvent(ctx: CommonHandlerContext<unknown>, block: EvmBlock, item: EventItem) {
    try {
        switch (item.evmLog.topics[0]) {
            case abi.events['Bid'].topic: {
                let e = normalize(abi.events['Bid'].decode(item.evmLog))
                return new ContractEventBid({
                    id: item.evmLog.id,
                    blockNumber: block.height,
                    transactionHash: item.transaction.hash,
                    blockTimestamp: new Date(block.timestamp),
                    contract: item.address,
                    eventName: 'Bid',
                    tokenId: e[0],
                    bidder: e[1],
                    bid: e[2],
                })
            }
            case abi.events['OwnershipTransferred'].topic: {
                let e = normalize(abi.events['OwnershipTransferred'].decode(item.evmLog))
                return new ContractEventOwnershipTransferred({
                    id: item.evmLog.id,
                    blockNumber: block.height,
                    transactionHash: item.transaction.hash,
                    blockTimestamp: new Date(block.timestamp),
                    contract: item.address,
                    eventName: 'OwnershipTransferred',
                    previousOwner: e[0],
                    newOwner: e[1],
                })
            }
            case abi.events['Start'].topic: {
                let e = normalize(abi.events['Start'].decode(item.evmLog))
                return new ContractEventStart({
                    id: item.evmLog.id,
                    blockNumber: block.height,
                    transactionHash: item.transaction.hash,
                    blockTimestamp: new Date(block.timestamp),
                    contract: item.address,
                    eventName: 'Start',
                    tokenId: e[0],
                })
            }
        }
    } catch (error) {
        ctx.log.error({error, blockNumber: block.height, blockHash: block.hash, address}, `Unable to decode event "${item.evmLog.topics[0]}"`)
    }
}

function parseFunction(ctx: CommonHandlerContext<unknown>, block: EvmBlock, item: FunctionItem) {
    try {
        switch (item.transaction.input.slice(0, 10)) {
            case abi.functions['bid'].sighash: {
                return new ContractFunctionBid({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    transactionHash: item.transaction.hash,
                    blockTimestamp: new Date(block.timestamp),
                    contract: item.address,
                    functionName: 'bid',
                    functionValue: item.transaction.value,
                })
            }
            case abi.functions['onERC721Received'].sighash: {
                let f = normalize(abi.functions['onERC721Received'].decode(item.transaction.input))
                return new ContractFunctionOnErc721Received({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    transactionHash: item.transaction.hash,
                    blockTimestamp: new Date(block.timestamp),
                    contract: item.address,
                    functionName: 'onERC721Received',
                    functionValue: item.transaction.value,
                    arg0: f[0],
                    arg1: f[1],
                    arg2: f[2],
                    arg3: f[3],
                })
            }
            case abi.functions['renounceOwnership'].sighash: {
                return new ContractFunctionRenounceOwnership({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    transactionHash: item.transaction.hash,
                    blockTimestamp: new Date(block.timestamp),
                    contract: item.address,
                    functionName: 'renounceOwnership',
                    functionValue: item.transaction.value,
                })
            }
            case abi.functions['setDuration'].sighash: {
                let f = normalize(abi.functions['setDuration'].decode(item.transaction.input))
                return new ContractFunctionSetDuration({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    transactionHash: item.transaction.hash,
                    blockTimestamp: new Date(block.timestamp),
                    contract: item.address,
                    functionName: 'setDuration',
                    functionValue: item.transaction.value,
                    duration: f[0],
                })
            }
            case abi.functions['setExtendedDuration'].sighash: {
                let f = normalize(abi.functions['setExtendedDuration'].decode(item.transaction.input))
                return new ContractFunctionSetExtendedDuration({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    transactionHash: item.transaction.hash,
                    blockTimestamp: new Date(block.timestamp),
                    contract: item.address,
                    functionName: 'setExtendedDuration',
                    functionValue: item.transaction.value,
                    extendedDuration: f[0],
                })
            }
            case abi.functions['setGLMR'].sighash: {
                let f = normalize(abi.functions['setGLMR'].decode(item.transaction.input))
                return new ContractFunctionSetGlmr({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    transactionHash: item.transaction.hash,
                    blockTimestamp: new Date(block.timestamp),
                    contract: item.address,
                    functionName: 'setGLMR',
                    functionValue: item.transaction.value,
                    glmr: f[0],
                })
            }
            case abi.functions['setMinBidIncrementPercent'].sighash: {
                let f = normalize(abi.functions['setMinBidIncrementPercent'].decode(item.transaction.input))
                return new ContractFunctionSetMinBidIncrementPercent({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    transactionHash: item.transaction.hash,
                    blockTimestamp: new Date(block.timestamp),
                    contract: item.address,
                    functionName: 'setMinBidIncrementPercent',
                    functionValue: item.transaction.value,
                    minBidIncrementPercent: f[0],
                })
            }
            case abi.functions['setMinFirstBid'].sighash: {
                let f = normalize(abi.functions['setMinFirstBid'].decode(item.transaction.input))
                return new ContractFunctionSetMinFirstBid({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    transactionHash: item.transaction.hash,
                    blockTimestamp: new Date(block.timestamp),
                    contract: item.address,
                    functionName: 'setMinFirstBid',
                    functionValue: item.transaction.value,
                    minFirstBid: f[0],
                })
            }
            case abi.functions['setTreasury'].sighash: {
                let f = normalize(abi.functions['setTreasury'].decode(item.transaction.input))
                return new ContractFunctionSetTreasury({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    transactionHash: item.transaction.hash,
                    blockTimestamp: new Date(block.timestamp),
                    contract: item.address,
                    functionName: 'setTreasury',
                    functionValue: item.transaction.value,
                    treasury: f[0],
                })
            }
            case abi.functions['start'].sighash: {
                return new ContractFunctionStart({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    transactionHash: item.transaction.hash,
                    blockTimestamp: new Date(block.timestamp),
                    contract: item.address,
                    functionName: 'start',
                    functionValue: item.transaction.value,
                })
            }
            case abi.functions['transferOwnership'].sighash: {
                let f = normalize(abi.functions['transferOwnership'].decode(item.transaction.input))
                return new ContractFunctionTransferOwnership({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    transactionHash: item.transaction.hash,
                    blockTimestamp: new Date(block.timestamp),
                    contract: item.address,
                    functionName: 'transferOwnership',
                    functionValue: item.transaction.value,
                    newOwner: f[0],
                })
            }
        }
    } catch (error) {
        ctx.log.error({error, blockNumber: block.height, blockHash: block.hash, address}, `Unable to decode function "${item.transaction.input.slice(0, 10)}"`)
    }
}
