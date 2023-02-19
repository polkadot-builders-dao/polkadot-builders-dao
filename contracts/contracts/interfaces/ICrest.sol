// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface ICrest is IERC721Enumerable {
    function mint() external;

    function mintSpecific(address to, uint96 dna) external;

    function burn(uint256 tokenId) external;
}
