import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './AuctionHouse.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Bid: new LogEvent<([tokenId: bigint, bidder: string, bid: bigint] & {tokenId: bigint, bidder: string, bid: bigint})>(
        abi, '0xdcd726e11f8b5e160f00290f0fe3a1abb547474e53a8e7a8f49a85e7b1ca3199'
    ),
    OwnershipTransferred: new LogEvent<([previousOwner: string, newOwner: string] & {previousOwner: string, newOwner: string})>(
        abi, '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0'
    ),
    Paused: new LogEvent<([account: string] & {account: string})>(
        abi, '0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258'
    ),
    Start: new LogEvent<([tokenId: bigint] & {tokenId: bigint})>(
        abi, '0xf06a29c94c6f4edc1085072972d9441f7603e81c8535a308f214285d0653c850'
    ),
    Unpaused: new LogEvent<([account: string] & {account: string})>(
        abi, '0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa'
    ),
}

export const functions = {
    bid: new Func<[], {}, []>(
        abi, '0x1998aeef'
    ),
    getAuction: new Func<[], {}, ([tokenId: bigint, startTime: bigint, endTime: bigint, currentBid: bigint, bidder: string, minBid: bigint, isFinished: boolean] & {tokenId: bigint, startTime: bigint, endTime: bigint, currentBid: bigint, bidder: string, minBid: bigint, isFinished: boolean})>(
        abi, '0x7327df25'
    ),
    getConfig: new Func<[], {}, ([treasury: string, token: string, glmr: string, duration: bigint, extendedDuration: bigint, minFirstBid: bigint, minBidIncrementPercent: bigint] & {treasury: string, token: string, glmr: string, duration: bigint, extendedDuration: bigint, minFirstBid: bigint, minBidIncrementPercent: bigint})>(
        abi, '0xc3f909d4'
    ),
    glmr: new Func<[], {}, string>(
        abi, '0x12d8e41b'
    ),
    onERC721Received: new Func<[_: string, _: string, _: bigint, _: string], {}, string>(
        abi, '0x150b7a02'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    pause: new Func<[], {}, []>(
        abi, '0x8456cb59'
    ),
    paused: new Func<[], {}, boolean>(
        abi, '0x5c975abb'
    ),
    renounceOwnership: new Func<[], {}, []>(
        abi, '0x715018a6'
    ),
    setDuration: new Func<[_duration: bigint], {_duration: bigint}, []>(
        abi, '0xf6be71d1'
    ),
    setExtendedDuration: new Func<[_extendedDuration: bigint], {_extendedDuration: bigint}, []>(
        abi, '0xb535ef80'
    ),
    setGLMR: new Func<[_glmr: string], {_glmr: string}, []>(
        abi, '0x8b058715'
    ),
    setMinBidIncrementPercent: new Func<[_minBidIncrementPercent: bigint], {_minBidIncrementPercent: bigint}, []>(
        abi, '0xe0f0815c'
    ),
    setMinFirstBid: new Func<[_minFirstBid: bigint], {_minFirstBid: bigint}, []>(
        abi, '0x3d44ce32'
    ),
    setTreasury: new Func<[_treasury: string], {_treasury: string}, []>(
        abi, '0xf0f44260'
    ),
    start: new Func<[], {}, []>(
        abi, '0xbe9a6555'
    ),
    transferOwnership: new Func<[newOwner: string], {newOwner: string}, []>(
        abi, '0xf2fde38b'
    ),
    treasury: new Func<[], {}, string>(
        abi, '0x61d027b3'
    ),
    unpause: new Func<[], {}, []>(
        abi, '0x3f4ba83a'
    ),
}

export class Contract extends ContractBase {

    getAuction(): Promise<([tokenId: bigint, startTime: bigint, endTime: bigint, currentBid: bigint, bidder: string, minBid: bigint, isFinished: boolean] & {tokenId: bigint, startTime: bigint, endTime: bigint, currentBid: bigint, bidder: string, minBid: bigint, isFinished: boolean})> {
        return this.eth_call(functions.getAuction, [])
    }

    getConfig(): Promise<([treasury: string, token: string, glmr: string, duration: bigint, extendedDuration: bigint, minFirstBid: bigint, minBidIncrementPercent: bigint] & {treasury: string, token: string, glmr: string, duration: bigint, extendedDuration: bigint, minFirstBid: bigint, minBidIncrementPercent: bigint})> {
        return this.eth_call(functions.getConfig, [])
    }

    glmr(): Promise<string> {
        return this.eth_call(functions.glmr, [])
    }

    onERC721Received(arg0: string, arg1: string, arg2: bigint, arg3: string): Promise<string> {
        return this.eth_call(functions.onERC721Received, [arg0, arg1, arg2, arg3])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    paused(): Promise<boolean> {
        return this.eth_call(functions.paused, [])
    }

    treasury(): Promise<string> {
        return this.eth_call(functions.treasury, [])
    }
}
