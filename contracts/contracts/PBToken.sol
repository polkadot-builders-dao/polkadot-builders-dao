// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {PBTokenComposer} from "./lib/PBTokenComposer.sol";
import {PBTokenDna} from "./lib/PBTokenDna.sol";
import {IPBTokenPartsStore} from "./interfaces/IPBTokenPartsStore.sol";
import {IPBToken} from "./interfaces/IPBToken.sol";

/// @custom:security-contact contact@polkadot-builders.xyz
contract PBToken is
    ERC721,
    ERC721Enumerable,
    ERC721Burnable,
    Ownable,
    EIP712,
    ERC721Votes,
    IPBToken
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Parts store contract address
    IPBTokenPartsStore public store;

    // auction house account address (can mint and burn)
    address public auctionHouse;

    // founders account address (receives 1 token every 10 mints, up to 2000 mints)
    address public founders;

    // Stores the DNA of each token
    mapping(uint256 => uint96) public dnaMap;

    constructor(
        IPBTokenPartsStore _store,
        address _auctionHouse,
        address _founders
    ) ERC721("Polkadot Builders", "PBT") EIP712("Polkadot Builders", "1") {
        store = _store;
        auctionHouse = _auctionHouse;
        founders = _founders;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "This token doesn't exist");

        return PBTokenComposer.getTokenMetadata(store, tokenId, dnaMap[tokenId]);
    }

    function setAuctionHouse(address _auctionHouse) public onlyOwner {
        auctionHouse = _auctionHouse;
    }

    function mint() public {
        require(msg.sender == auctionHouse, "Only auction house contract can mint");

        _mintOne(auctionHouse);

        // Mint a token for founders every 10 mints, until there are 2000 minted
        uint256 currentId = _tokenIdCounter.current();
        if (currentId <= 2000 && currentId % 10 == 0) _mintOne(founders);
    }

    function _mintOne(address to) internal {
        // Increment counter to get the next tokenId
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        // Generate and store dna for this token
        dnaMap[tokenId] = PBTokenDna.generateDna(address(store), block.timestamp + tokenId);

        // Mint :rock:
        _safeMint(to, tokenId);
    }

    function burn(uint256 tokenId) public virtual override(ERC721Burnable, IPBToken) {
        super.burn(tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Votes) {
        super._afterTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
