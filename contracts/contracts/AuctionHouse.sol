// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import {ICrest} from "./interfaces/ICrest.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Auction House contract
 * @author Polkadot Builders
 * @dev This contract allows for the creation and execution of auctions for Polkadot Builder Crests NFTs.
 * @custom:security-contact contact@polkadot-builders.xyz
 */
contract AuctionHouse is Ownable, ReentrancyGuard, IERC721Receiver {
    /**
     * @dev AuctionConfig struct containing auction configuration parameters
     */
    struct AuctionConfig {
        address treasury;
        address token;
        address glmr;
        uint duration;
        uint extendedDuration;
        uint minFirstBid;
        uint minBidIncrementPercent;
    }

    /**
     * @dev AuctionState struct containing the current state of an auction
     */
    struct AuctionState {
        uint tokenId;
        uint startTime;
        uint endTime;
        uint currentBid;
        address bidder;
        uint minBid;
        bool isFinished;
    }

    address public treasury;
    IERC20 public glmr = IERC20(0x0000000000000000000000000000000000000802);

    ICrest private token;
    uint private duration = 1 days;
    uint private extendedDuration = 10 minutes;
    uint private minFirstBid = 1 ether;
    uint private minBidIncrementPercent = 1;

    uint private startTime;
    uint private endTime;
    uint private currentBid;
    uint private tokenId;
    address private bidder;

    event Bid(uint tokenId, address bidder, uint bid);
    event Start(uint tokenId);

    /**
     * @dev Initializes the contract with the given token and treasury addresses
     * @param _token The ERC721 token used in the auction
     * @param _treasury The address to receive the auction proceeds
     */
    constructor(ICrest _token, address _treasury) {
        token = _token;
        treasury = _treasury;
    }

    /**
     * @notice Sets the address of the treasury account
     * @dev Sets the address of the treasury account
     * @param _treasury The new treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    /**
     * @notice Sets the address of the ERC20 precompiled contract for GLMR
     * @dev Sets the address of the ERC20 precompiled contract for GLMR
     * @param _glmr The new GLMR contract address
     */
    function setGLMR(IERC20 _glmr) external onlyOwner {
        glmr = _glmr;
    }

    /**
     * @notice Sets the duration, in seconds, of the auction
     * @dev Sets the duration, in seconds, of the auction
     * @param _duration The new duration, in seconds, of the auction
     */
    function setDuration(uint _duration) external onlyOwner {
        duration = _duration;
    }

    /**
     * @notice Sets the extended duration, in seconds, of the auction
     * @dev Sets the extended duration, in seconds, of the auction
     * @param _extendedDuration The new extended duration, in seconds, of the auction
     */
    function setExtendedDuration(uint _extendedDuration) external onlyOwner {
        extendedDuration = _extendedDuration;
    }

    /**
     * @dev Sets the minimum bid amount for the auction
     * @param _minFirstBid The new minimum bid amount for the auction
     */
    function setMinFirstBid(uint _minFirstBid) external onlyOwner {
        minFirstBid = _minFirstBid;
    }

    /**
     * @dev Sets the minimum bid increment percentage for the auction
     * @param _minBidIncrementPercent The new minimum bid increment percentage for the auction
     */
    function setMinBidIncrementPercent(uint _minBidIncrementPercent) external onlyOwner {
        minBidIncrementPercent = _minBidIncrementPercent;
    }

    /**
     * @dev Returns the current auction house configuration parameters
     * @dev Returns the current auction house configuration parameters
     */
    function getConfig() external view returns (AuctionConfig memory) {
        return
            AuctionConfig(
                treasury,
                address(token),
                address(glmr),
                duration,
                extendedDuration,
                minFirstBid,
                minBidIncrementPercent
            );
    }

    /**
     * @notice Returns the state of the current auction.
     * @return AuctionState The state of the current auction.
     */
    function getAuction() external view returns (AuctionState memory) {
        return
            AuctionState(
                tokenId,
                startTime,
                endTime,
                currentBid,
                bidder,
                getCurrentMinBid(),
                bool(block.timestamp > endTime)
            );
    }

    /**
     * @notice Returns the minimum bid amount required for the current auction.
     * @dev Returns the minimum bid amount required for the current auction.
     * @return uint The minimum bid amount required for the current auction.
     */
    function getCurrentMinBid() private view returns (uint) {
        if (currentBid == 0) return minFirstBid;
        return currentBid + ((currentBid * minBidIncrementPercent) / 100);
    }

    /**
     * @notice Place a bid for the current auction.
     * @dev Place a bid for the current auction.
     */
    function bid() external payable nonReentrant {
        require(block.timestamp >= startTime, "Auction hasn't started yet");
        require(block.timestamp <= endTime, "Auction has ended");
        require(msg.value >= getCurrentMinBid(), "Bid amount is too low");

        // refund previous bidder
        if (bidder != address(0)) safeSendEther(payable(bidder), currentBid);

        // extend auction duration
        if (block.timestamp + extendedDuration > endTime)
            endTime = block.timestamp + extendedDuration;

        bidder = msg.sender;
        currentBid = msg.value;

        emit Bid(tokenId, bidder, currentBid);
    }

    /**
     * @notice Ends previous auction and starts a new one.
     * @dev Ends previous auction and starts a new one.
     */
    function start() external nonReentrant {
        require(block.timestamp > endTime, "Auction hasn't ended yet");

        // send the token to the latest winner
        if (bidder != address(0))
            token.safeTransferFrom(address(this), bidder, tokenId);
            // or burn the nft if there's no bidder
        else if (tokenId > 0) token.burn(tokenId);

        // send the bid amount to the treasury
        if (currentBid > 0) safeSendEther(payable(treasury), currentBid);

        // mint a new token
        token.mint();

        // initialize next auction
        startTime = block.timestamp;
        endTime = startTime + duration;
        currentBid = 0;
        bidder = address(0);
        tokenId = token.tokenOfOwnerByIndex(address(this), 0);
        emit Start(tokenId);
    }

    /**
     * @dev Safely sends Ether to the recipient.
     * @param _to The recipient of the Ether.
     * @param _amount The amount of Ether to send.
     */
    function safeSendEther(address payable _to, uint _amount) private {
        (bool sent, ) = _to.call{value: _amount}("");
        // transfer may fail if the recipient is a contract. If so, send GLMR over precompiled ERC20 contract
        if (!sent) glmr.transfer(_to, _amount);
    }

    /**
     * @dev Required method for a contract to allow receiving an ERC721 token.
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
