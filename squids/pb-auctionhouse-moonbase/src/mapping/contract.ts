import {CommonHandlerContext, EvmBlock} from '@subsquid/evm-processor'
import {LogItem, TransactionItem} from '@subsquid/evm-processor/lib/interfaces/dataSelection'
import {Store} from '../db'
import {EntityBuffer} from '../entityBuffer'
import {ContractEventBid, ContractEventOwnershipTransferred, ContractEventPaused, ContractEventStart, ContractEventUnpaused, ContractFunctionBid, ContractFunctionOnErc721Received, ContractFunctionPause, ContractFunctionRenounceOwnership, ContractFunctionSetDuration, ContractFunctionSetExtendedDuration, ContractFunctionSetGlmr, ContractFunctionSetMinBidIncrementPercent, ContractFunctionSetMinFirstBid, ContractFunctionSetTreasury, ContractFunctionStart, ContractFunctionTransferOwnership, ContractFunctionUnpause} from '../model'
import * as spec from '../abi/AuctionHouse'
import {normalize} from '../util'

export {spec}

export const address = '0x89be56ce74c86ea90e429fbb98824aef435c8e87'

type EventItem = LogItem<{evmLog: {topics: true, data: true}, transaction: {hash: true}}>
type FunctionItem = TransactionItem<{transaction: {hash: true, input: true, value: true, status: true}}>

export function parse(ctx: CommonHandlerContext<Store>, block: EvmBlock, item: EventItem | FunctionItem) {
    switch (item.kind) {
        case 'evmLog':
            return parseEvent(ctx, block, item)
        case 'transaction':
            return parseFunction(ctx, block, item)
    }
}

function parseEvent(ctx: CommonHandlerContext<Store>, block: EvmBlock, item: EventItem) {
    try {
        switch (item.evmLog.topics[0]) {
            case spec.events['Bid'].topic: {
                let e = normalize(spec.events['Bid'].decode(item.evmLog))
                EntityBuffer.add(
                    new ContractEventBid({
                        id: item.evmLog.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        eventName: 'Bid',
                        tokenId: e[0],
                        bidder: e[1],
                        bid: e[2],
                    })
                )
                break
            }
            case spec.events['OwnershipTransferred'].topic: {
                let e = normalize(spec.events['OwnershipTransferred'].decode(item.evmLog))
                EntityBuffer.add(
                    new ContractEventOwnershipTransferred({
                        id: item.evmLog.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        eventName: 'OwnershipTransferred',
                        previousOwner: e[0],
                        newOwner: e[1],
                    })
                )
                break
            }
            case spec.events['Paused'].topic: {
                let e = normalize(spec.events['Paused'].decode(item.evmLog))
                EntityBuffer.add(
                    new ContractEventPaused({
                        id: item.evmLog.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        eventName: 'Paused',
                        account: e[0],
                    })
                )
                break
            }
            case spec.events['Start'].topic: {
                let e = normalize(spec.events['Start'].decode(item.evmLog))
                EntityBuffer.add(
                    new ContractEventStart({
                        id: item.evmLog.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        eventName: 'Start',
                        tokenId: e[0],
                    })
                )
                break
            }
            case spec.events['Unpaused'].topic: {
                let e = normalize(spec.events['Unpaused'].decode(item.evmLog))
                EntityBuffer.add(
                    new ContractEventUnpaused({
                        id: item.evmLog.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        eventName: 'Unpaused',
                        account: e[0],
                    })
                )
                break
            }
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: block.height, blockHash: block.hash, address}, `Unable to decode event "${item.evmLog.topics[0]}"`)
    }
}

function parseFunction(ctx: CommonHandlerContext<Store>, block: EvmBlock, item: FunctionItem) {
    try {
        switch (item.transaction.input.slice(0, 10)) {
            case spec.functions['bid'].sighash: {
                let f = normalize(spec.functions['bid'].decode(item.transaction.input))
                EntityBuffer.add(
                    new ContractFunctionBid({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'bid',
                        functionValue: item.transaction.value,
                        functionSuccess: Boolean(item.transaction.status),
                    })
                )
                break
            }
            case spec.functions['onERC721Received'].sighash: {
                let f = normalize(spec.functions['onERC721Received'].decode(item.transaction.input))
                EntityBuffer.add(
                    new ContractFunctionOnErc721Received({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'onERC721Received',
                        functionValue: item.transaction.value,
                        functionSuccess: Boolean(item.transaction.status),
                        param0: f[0],
                        param1: f[1],
                        param2: f[2],
                        param3: f[3],
                    })
                )
                break
            }
            case spec.functions['pause'].sighash: {
                let f = normalize(spec.functions['pause'].decode(item.transaction.input))
                EntityBuffer.add(
                    new ContractFunctionPause({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'pause',
                        functionValue: item.transaction.value,
                        functionSuccess: Boolean(item.transaction.status),
                    })
                )
                break
            }
            case spec.functions['renounceOwnership'].sighash: {
                let f = normalize(spec.functions['renounceOwnership'].decode(item.transaction.input))
                EntityBuffer.add(
                    new ContractFunctionRenounceOwnership({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'renounceOwnership',
                        functionValue: item.transaction.value,
                        functionSuccess: Boolean(item.transaction.status),
                    })
                )
                break
            }
            case spec.functions['setDuration'].sighash: {
                let f = normalize(spec.functions['setDuration'].decode(item.transaction.input))
                EntityBuffer.add(
                    new ContractFunctionSetDuration({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'setDuration',
                        functionValue: item.transaction.value,
                        functionSuccess: Boolean(item.transaction.status),
                        duration: f[0],
                    })
                )
                break
            }
            case spec.functions['setExtendedDuration'].sighash: {
                let f = normalize(spec.functions['setExtendedDuration'].decode(item.transaction.input))
                EntityBuffer.add(
                    new ContractFunctionSetExtendedDuration({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'setExtendedDuration',
                        functionValue: item.transaction.value,
                        functionSuccess: Boolean(item.transaction.status),
                        extendedDuration: f[0],
                    })
                )
                break
            }
            case spec.functions['setGLMR'].sighash: {
                let f = normalize(spec.functions['setGLMR'].decode(item.transaction.input))
                EntityBuffer.add(
                    new ContractFunctionSetGlmr({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'setGLMR',
                        functionValue: item.transaction.value,
                        functionSuccess: Boolean(item.transaction.status),
                        glmr: f[0],
                    })
                )
                break
            }
            case spec.functions['setMinBidIncrementPercent'].sighash: {
                let f = normalize(spec.functions['setMinBidIncrementPercent'].decode(item.transaction.input))
                EntityBuffer.add(
                    new ContractFunctionSetMinBidIncrementPercent({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'setMinBidIncrementPercent',
                        functionValue: item.transaction.value,
                        functionSuccess: Boolean(item.transaction.status),
                        minBidIncrementPercent: f[0],
                    })
                )
                break
            }
            case spec.functions['setMinFirstBid'].sighash: {
                let f = normalize(spec.functions['setMinFirstBid'].decode(item.transaction.input))
                EntityBuffer.add(
                    new ContractFunctionSetMinFirstBid({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'setMinFirstBid',
                        functionValue: item.transaction.value,
                        functionSuccess: Boolean(item.transaction.status),
                        minFirstBid: f[0],
                    })
                )
                break
            }
            case spec.functions['setTreasury'].sighash: {
                let f = normalize(spec.functions['setTreasury'].decode(item.transaction.input))
                EntityBuffer.add(
                    new ContractFunctionSetTreasury({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'setTreasury',
                        functionValue: item.transaction.value,
                        functionSuccess: Boolean(item.transaction.status),
                        treasury: f[0],
                    })
                )
                break
            }
            case spec.functions['start'].sighash: {
                let f = normalize(spec.functions['start'].decode(item.transaction.input))
                EntityBuffer.add(
                    new ContractFunctionStart({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'start',
                        functionValue: item.transaction.value,
                        functionSuccess: Boolean(item.transaction.status),
                    })
                )
                break
            }
            case spec.functions['transferOwnership'].sighash: {
                let f = normalize(spec.functions['transferOwnership'].decode(item.transaction.input))
                EntityBuffer.add(
                    new ContractFunctionTransferOwnership({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'transferOwnership',
                        functionValue: item.transaction.value,
                        functionSuccess: Boolean(item.transaction.status),
                        newOwner: f[0],
                    })
                )
                break
            }
            case spec.functions['unpause'].sighash: {
                let f = normalize(spec.functions['unpause'].decode(item.transaction.input))
                EntityBuffer.add(
                    new ContractFunctionUnpause({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'unpause',
                        functionValue: item.transaction.value,
                        functionSuccess: Boolean(item.transaction.status),
                    })
                )
                break
            }
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: block.height, blockHash: block.hash, address}, `Unable to decode function "${item.transaction.input.slice(0, 10)}"`)
    }
}
