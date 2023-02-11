// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "hardhat/console.sol";
import {IPBToken} from "./interfaces/IPBToken.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract PBAuctionHouse is Ownable, ReentrancyGuard, IERC721Receiver {
    struct AuctionConfig {
        address treasury;
        address token;
        uint duration;
        uint extendedDuration;
        uint minFirstBid;
        uint minBidIncrementPercent;
    }

    struct AuctionState {
        uint tokenId;
        uint startTime;
        uint endTime;
        uint currentBid;
        address bidder;
        uint minBid;
        bool isFinished;
    }

    address treasury;

    IPBToken private token;
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

    constructor(IPBToken _token, address _treasury) {
        token = _token;
        treasury = _treasury;
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    function setDuration(uint _duration) external onlyOwner {
        duration = _duration;
    }

    function setExtendedDuration(uint _extendedDuration) external onlyOwner {
        extendedDuration = _extendedDuration;
    }

    function setMinFirstBid(uint _minFirstBid) external onlyOwner {
        minFirstBid = _minFirstBid;
    }

    function setMinBidIncrementPercent(uint _minBidIncrementPercent) external onlyOwner {
        minBidIncrementPercent = _minBidIncrementPercent;
    }

    function getConfig() external view returns (AuctionConfig memory) {
        return
            AuctionConfig(
                treasury,
                address(token),
                duration,
                extendedDuration,
                minFirstBid,
                minBidIncrementPercent
            );
    }

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

    function getCurrentMinBid() private view returns (uint) {
        if (currentBid == 0) return minFirstBid;
        return currentBid + ((currentBid * minBidIncrementPercent) / 100);
    }

    // bid for current token
    function bid() external payable nonReentrant {
        require(block.timestamp >= startTime, "Auction hasn't started yet");
        require(block.timestamp <= endTime, "Auction has ended");
        require(msg.value >= minFirstBid, "Bid amount is too low");
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

    function start() external nonReentrant {
        require(block.timestamp > endTime, "Auction hasn't ended yet");

        // send the token to the latest winner
        if (bidder != address(0))
            token.safeTransferFrom(address(this), bidder, tokenId);
            // or burn the nft if there's no bidder
        else if (tokenId > 0) token.burn(tokenId);

        // send the bid amount to the treasury
        safeSendEther(payable(treasury), currentBid);

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

    function safeSendEther(address payable _to, uint _amount) private {
        // TODO test against non payable contract
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
