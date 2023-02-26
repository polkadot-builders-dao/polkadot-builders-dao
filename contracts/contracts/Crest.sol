// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {TokenGenerator} from "./lib/TokenGenerator.sol";
import {DnaManager} from "./lib/DnaManager.sol";
import {ICrest} from "./interfaces/ICrest.sol";

/**
 * @title Polkadot Builder Crest NFT
 * @author Polkadot Builders
 * @dev This contract allows for the creation and execution of auctions for Polkadot Builder Crests NFTs.
 * @custom:security-contact contact@polkadot-builders.xyz
 */
contract Crest is ERC721, ERC721Enumerable, ERC721Burnable, Ownable, EIP712, ERC721Votes, ICrest {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Parts store contract address
    address public store;

    // auction house account address (can mint and burn)
    address public auctionHouse;

    // founders account address (receives 1 token every 10 mints, up to 2000 mints)
    address public founders;

    // Stores the DNA of each token
    mapping(uint256 => uint96) public dnaMap;

    string private _contractURI = "https://polkadot-builders.xyz/external/crest-contracts-uri.json";

    /**
     * @dev Constructor function that sets the initial values for the Polkadot Builder Crest contract.
     * @param _store The address of the store contract.
     * @param _auctionHouse The address of the auction house contract.
     * @param _founders The address of the founders who will receive tokens.
     */
    constructor(
        address _store,
        address _auctionHouse,
        address _founders
    ) ERC721("Polkadot Builder Crest", "PBC") EIP712("Polkadot Builder Crest", "1") {
        store = _store;
        auctionHouse = _auctionHouse;
        founders = _founders;
    }

    /**
     * @notice Returns the URI of the contract metadata.
     * @return The URI string.
     */
    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    /**
     * @notice Sets the URI of the contract metadata.
     * @dev Only the contract owner can call this function.
     * @param _uri The URI string.
     */
    function setContractURI(string memory _uri) public onlyOwner {
        _contractURI = _uri;
    }

    /**
     * @notice Returns the URI of the token metadata.
     * @param tokenId The ID of the token.
     * @return The URI string.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "This token doesn't exist");

        return TokenGenerator.generateTokenURI(store, tokenId, dnaMap[tokenId]);
    }

    /**
     * @notice Sets the address of the auction house contract.
     * @dev Only the contract owner can call this function.
     * @param _auctionHouse The address of the auction house contract.
     */
    function setAuctionHouse(address _auctionHouse) public onlyOwner {
        auctionHouse = _auctionHouse;
    }

    /**
     * @notice Sets the address of the founders account.
     * @dev Only the contract owner can call this function.
     * @param _founders The address of the founders account.
     */
    function setFounders(address _founders) public onlyOwner {
        founders = _founders;
    }

    /**
     * @notice Mints a new token for the auction house.
     * @dev Only the auction house contract can call this function.
     */
    function mint() public {
        require(msg.sender == auctionHouse, "Only auction house contract can mint");

        // Mint a token for founders every 10 mints, until there are 2000 minted
        uint256 currentId = _tokenIdCounter.current();
        if (currentId <= 2000 && currentId % 10 == 9) _mintOne(founders);

        _mintOne(auctionHouse);
    }

    function _mintOne(address to) internal {
        // Increment counter to get the next tokenId
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        // Generate and store dna for this token
        dnaMap[tokenId] = DnaManager.generateDna(store, block.timestamp + tokenId);

        // Mint :rock:
        _safeMint(to, tokenId);
    }

    /**
     * @notice Mints a new token to a specific address with a given DNA.
     * @dev Only the contract owner can call this function.
     * @param to The address to receive the token.
     * @param dna The DNA value for the token.
     */
    function mintSpecific(address to, uint96 dna) public onlyOwner {
        // Increment counter to get the next tokenId
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        // Store dna for this token
        dnaMap[tokenId] = dna;

        // Mint :rock:
        _safeMint(to, tokenId);
    }

    /**
     * @notice Burns a token with the specified ID.
     * @param tokenId The ID of the token to burn.
     */
    function burn(uint256 tokenId) public virtual override(ERC721Burnable, ICrest) {
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
