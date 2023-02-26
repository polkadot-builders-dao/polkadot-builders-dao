import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './AuctionHouse.abi'

export const abi = new ethers.utils.Interface(ABI_JSON);

export const events = {
    Bid: new LogEvent<([tokenId: ethers.BigNumber, bidder: string, bid: ethers.BigNumber] & {tokenId: ethers.BigNumber, bidder: string, bid: ethers.BigNumber})>(
        abi, '0xdcd726e11f8b5e160f00290f0fe3a1abb547474e53a8e7a8f49a85e7b1ca3199'
    ),
    OwnershipTransferred: new LogEvent<([previousOwner: string, newOwner: string] & {previousOwner: string, newOwner: string})>(
        abi, '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0'
    ),
    Start: new LogEvent<([tokenId: ethers.BigNumber] & {tokenId: ethers.BigNumber})>(
        abi, '0xf06a29c94c6f4edc1085072972d9441f7603e81c8535a308f214285d0653c850'
    ),
}

export const functions = {
    bid: new Func<[], {}, []>(
        abi, '0x1998aeef'
    ),
    getAuction: new Func<[], {}, ([tokenId: ethers.BigNumber, startTime: ethers.BigNumber, endTime: ethers.BigNumber, currentBid: ethers.BigNumber, bidder: string, minBid: ethers.BigNumber, isFinished: boolean] & {tokenId: ethers.BigNumber, startTime: ethers.BigNumber, endTime: ethers.BigNumber, currentBid: ethers.BigNumber, bidder: string, minBid: ethers.BigNumber, isFinished: boolean})>(
        abi, '0x7327df25'
    ),
    getConfig: new Func<[], {}, ([treasury: string, token: string, duration: ethers.BigNumber, extendedDuration: ethers.BigNumber, minFirstBid: ethers.BigNumber, minBidIncrementPercent: ethers.BigNumber] & {treasury: string, token: string, duration: ethers.BigNumber, extendedDuration: ethers.BigNumber, minFirstBid: ethers.BigNumber, minBidIncrementPercent: ethers.BigNumber})>(
        abi, '0xc3f909d4'
    ),
    onERC721Received: new Func<[_: string, _: string, _: ethers.BigNumber, _: string], {}, string>(
        abi, '0x150b7a02'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    renounceOwnership: new Func<[], {}, []>(
        abi, '0x715018a6'
    ),
    setDuration: new Func<[_duration: ethers.BigNumber], {_duration: ethers.BigNumber}, []>(
        abi, '0xf6be71d1'
    ),
    setExtendedDuration: new Func<[_extendedDuration: ethers.BigNumber], {_extendedDuration: ethers.BigNumber}, []>(
        abi, '0xb535ef80'
    ),
    setMinBidIncrementPercent: new Func<[_minBidIncrementPercent: ethers.BigNumber], {_minBidIncrementPercent: ethers.BigNumber}, []>(
        abi, '0xe0f0815c'
    ),
    setMinFirstBid: new Func<[_minFirstBid: ethers.BigNumber], {_minFirstBid: ethers.BigNumber}, []>(
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
}

export class Contract extends ContractBase {

    getAuction(): Promise<([tokenId: ethers.BigNumber, startTime: ethers.BigNumber, endTime: ethers.BigNumber, currentBid: ethers.BigNumber, bidder: string, minBid: ethers.BigNumber, isFinished: boolean] & {tokenId: ethers.BigNumber, startTime: ethers.BigNumber, endTime: ethers.BigNumber, currentBid: ethers.BigNumber, bidder: string, minBid: ethers.BigNumber, isFinished: boolean})> {
        return this.eth_call(functions.getAuction, [])
    }

    getConfig(): Promise<([treasury: string, token: string, duration: ethers.BigNumber, extendedDuration: ethers.BigNumber, minFirstBid: ethers.BigNumber, minBidIncrementPercent: ethers.BigNumber] & {treasury: string, token: string, duration: ethers.BigNumber, extendedDuration: ethers.BigNumber, minFirstBid: ethers.BigNumber, minBidIncrementPercent: ethers.BigNumber})> {
        return this.eth_call(functions.getConfig, [])
    }

    onERC721Received(arg0: string, arg1: string, arg2: ethers.BigNumber, arg3: string): Promise<string> {
        return this.eth_call(functions.onERC721Received, [arg0, arg1, arg2, arg3])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }
}
