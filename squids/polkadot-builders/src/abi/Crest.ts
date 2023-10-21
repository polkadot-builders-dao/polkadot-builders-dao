import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './Crest.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Approval: new LogEvent<([owner: string, approved: string, tokenId: bigint] & {owner: string, approved: string, tokenId: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    ApprovalForAll: new LogEvent<([owner: string, operator: string, approved: boolean] & {owner: string, operator: string, approved: boolean})>(
        abi, '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
    ),
    DelegateChanged: new LogEvent<([delegator: string, fromDelegate: string, toDelegate: string] & {delegator: string, fromDelegate: string, toDelegate: string})>(
        abi, '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f'
    ),
    DelegateVotesChanged: new LogEvent<([delegate: string, previousBalance: bigint, newBalance: bigint] & {delegate: string, previousBalance: bigint, newBalance: bigint})>(
        abi, '0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724'
    ),
    OwnershipTransferred: new LogEvent<([previousOwner: string, newOwner: string] & {previousOwner: string, newOwner: string})>(
        abi, '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0'
    ),
    Transfer: new LogEvent<([from: string, to: string, tokenId: bigint] & {from: string, to: string, tokenId: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
}

export const functions = {
    DOMAIN_SEPARATOR: new Func<[], {}, string>(
        abi, '0x3644e515'
    ),
    approve: new Func<[to: string, tokenId: bigint], {to: string, tokenId: bigint}, []>(
        abi, '0x095ea7b3'
    ),
    auctionHouse: new Func<[], {}, string>(
        abi, '0xed9152c8'
    ),
    balanceOf: new Func<[owner: string], {owner: string}, bigint>(
        abi, '0x70a08231'
    ),
    burn: new Func<[tokenId: bigint], {tokenId: bigint}, []>(
        abi, '0x42966c68'
    ),
    contractURI: new Func<[], {}, string>(
        abi, '0xe8a3d485'
    ),
    delegate: new Func<[delegatee: string], {delegatee: string}, []>(
        abi, '0x5c19a95c'
    ),
    delegateBySig: new Func<[delegatee: string, nonce: bigint, expiry: bigint, v: number, r: string, s: string], {delegatee: string, nonce: bigint, expiry: bigint, v: number, r: string, s: string}, []>(
        abi, '0xc3cda520'
    ),
    delegates: new Func<[account: string], {account: string}, string>(
        abi, '0x587cde1e'
    ),
    dnaMap: new Func<[_: bigint], {}, bigint>(
        abi, '0x6922a963'
    ),
    founders: new Func<[], {}, string>(
        abi, '0x411b007e'
    ),
    getApproved: new Func<[tokenId: bigint], {tokenId: bigint}, string>(
        abi, '0x081812fc'
    ),
    getPastTotalSupply: new Func<[blockNumber: bigint], {blockNumber: bigint}, bigint>(
        abi, '0x8e539e8c'
    ),
    getPastVotes: new Func<[account: string, blockNumber: bigint], {account: string, blockNumber: bigint}, bigint>(
        abi, '0x3a46b1a8'
    ),
    getVotes: new Func<[account: string], {account: string}, bigint>(
        abi, '0x9ab24eb0'
    ),
    isApprovedForAll: new Func<[owner: string, operator: string], {owner: string, operator: string}, boolean>(
        abi, '0xe985e9c5'
    ),
    mint: new Func<[], {}, []>(
        abi, '0x1249c58b'
    ),
    mintSpecific: new Func<[to: string, dna: bigint], {to: string, dna: bigint}, []>(
        abi, '0x0b6b7eab'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    nonces: new Func<[owner: string], {owner: string}, bigint>(
        abi, '0x7ecebe00'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    ownerOf: new Func<[tokenId: bigint], {tokenId: bigint}, string>(
        abi, '0x6352211e'
    ),
    renounceOwnership: new Func<[], {}, []>(
        abi, '0x715018a6'
    ),
    'safeTransferFrom(address,address,uint256)': new Func<[from: string, to: string, tokenId: bigint], {from: string, to: string, tokenId: bigint}, []>(
        abi, '0x42842e0e'
    ),
    'safeTransferFrom(address,address,uint256,bytes)': new Func<[from: string, to: string, tokenId: bigint, data: string], {from: string, to: string, tokenId: bigint, data: string}, []>(
        abi, '0xb88d4fde'
    ),
    setApprovalForAll: new Func<[operator: string, approved: boolean], {operator: string, approved: boolean}, []>(
        abi, '0xa22cb465'
    ),
    setAuctionHouse: new Func<[_auctionHouse: string], {_auctionHouse: string}, []>(
        abi, '0xe76d8952'
    ),
    setContractURI: new Func<[_uri: string], {_uri: string}, []>(
        abi, '0x938e3d7b'
    ),
    setFounders: new Func<[_founders: string], {_founders: string}, []>(
        abi, '0x201afd83'
    ),
    store: new Func<[], {}, string>(
        abi, '0x975057e7'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    tokenByIndex: new Func<[index: bigint], {index: bigint}, bigint>(
        abi, '0x4f6ccce7'
    ),
    tokenOfOwnerByIndex: new Func<[owner: string, index: bigint], {owner: string, index: bigint}, bigint>(
        abi, '0x2f745c59'
    ),
    tokenURI: new Func<[tokenId: bigint], {tokenId: bigint}, string>(
        abi, '0xc87b56dd'
    ),
    totalSupply: new Func<[], {}, bigint>(
        abi, '0x18160ddd'
    ),
    transferFrom: new Func<[from: string, to: string, tokenId: bigint], {from: string, to: string, tokenId: bigint}, []>(
        abi, '0x23b872dd'
    ),
    transferOwnership: new Func<[newOwner: string], {newOwner: string}, []>(
        abi, '0xf2fde38b'
    ),
}

export class Contract extends ContractBase {

    DOMAIN_SEPARATOR(): Promise<string> {
        return this.eth_call(functions.DOMAIN_SEPARATOR, [])
    }

    auctionHouse(): Promise<string> {
        return this.eth_call(functions.auctionHouse, [])
    }

    balanceOf(owner: string): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [owner])
    }

    contractURI(): Promise<string> {
        return this.eth_call(functions.contractURI, [])
    }

    delegates(account: string): Promise<string> {
        return this.eth_call(functions.delegates, [account])
    }

    dnaMap(arg0: bigint): Promise<bigint> {
        return this.eth_call(functions.dnaMap, [arg0])
    }

    founders(): Promise<string> {
        return this.eth_call(functions.founders, [])
    }

    getApproved(tokenId: bigint): Promise<string> {
        return this.eth_call(functions.getApproved, [tokenId])
    }

    getPastTotalSupply(blockNumber: bigint): Promise<bigint> {
        return this.eth_call(functions.getPastTotalSupply, [blockNumber])
    }

    getPastVotes(account: string, blockNumber: bigint): Promise<bigint> {
        return this.eth_call(functions.getPastVotes, [account, blockNumber])
    }

    getVotes(account: string): Promise<bigint> {
        return this.eth_call(functions.getVotes, [account])
    }

    isApprovedForAll(owner: string, operator: string): Promise<boolean> {
        return this.eth_call(functions.isApprovedForAll, [owner, operator])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    nonces(owner: string): Promise<bigint> {
        return this.eth_call(functions.nonces, [owner])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    ownerOf(tokenId: bigint): Promise<string> {
        return this.eth_call(functions.ownerOf, [tokenId])
    }

    store(): Promise<string> {
        return this.eth_call(functions.store, [])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    tokenByIndex(index: bigint): Promise<bigint> {
        return this.eth_call(functions.tokenByIndex, [index])
    }

    tokenOfOwnerByIndex(owner: string, index: bigint): Promise<bigint> {
        return this.eth_call(functions.tokenOfOwnerByIndex, [owner, index])
    }

    tokenURI(tokenId: bigint): Promise<string> {
        return this.eth_call(functions.tokenURI, [tokenId])
    }

    totalSupply(): Promise<bigint> {
        return this.eth_call(functions.totalSupply, [])
    }
}
