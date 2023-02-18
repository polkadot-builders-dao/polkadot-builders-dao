// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "hardhat/console.sol";
import {IPBTokenPartsStore} from "../interfaces/IPBTokenPartsStore.sol";

library PBTokenDna {
    struct TokenTraits {
        uint8 bgColorId;
        uint8 googlesColorId;
        uint8 crownId;
        uint8 doodadId;
        uint8 garlandId;
        uint8 shieldId;
        uint8 logoPalette1Id;
        uint8 logoPalette2Id;
        uint8 logo1Id;
        uint8 logo2Id;
        uint8 logo3Id;
        uint8 logo4Id;
    }

    /**
     * @dev using an address as param type to prevent 'invalid type' error when executing tests
     */
    function generateDna(address storeAddress, uint256 seed) public view returns (uint96) {
        IPBTokenPartsStore store = IPBTokenPartsStore(storeAddress);

        require(store.bgColorsCount() > 0, "No bg colors");
        require(store.googlesColorsCount() > 0, "No googles colors");
        require(store.crownsCount() > 0, "No crowns");
        require(store.doodadsCount() > 0, "No doodads");
        require(store.garlandsCount() > 0, "No garlands");
        require(store.shieldsCount() > 0, "No shields");
        require(store.logoPalettesCount() > 0, "No logo palettes");
        require(store.logos1Count() > 0, "No logos1");
        require(store.logos2Count() > 0, "No logos2");
        require(store.logos3Count() > 0, "No logos3");
        require(store.logos4Count() > 0, "No logos4");

        // not truely random but it won't matter, we want a unique dna based on any number, usually a timestamp
        uint rand = uint(keccak256(abi.encodePacked(seed)));

        return reduceDna(storeAddress, uint96(rand));
    }

    /**
     * @dev using an address as param type to prevent 'invalid type' error when executing tests
     */
    function reduceDna(address storeAddress, uint96 dna) private view returns (uint96) {
        IPBTokenPartsStore store = IPBTokenPartsStore(storeAddress);

        TokenTraits memory image = TokenTraits({
            bgColorId: uint8(dna % store.bgColorsCount()),
            googlesColorId: uint8((dna >> 8) % store.googlesColorsCount()),
            crownId: uint8((dna >> 16) % store.crownsCount()),
            doodadId: uint8((dna >> 24) % store.doodadsCount()),
            garlandId: uint8((dna >> 32) % store.garlandsCount()),
            shieldId: uint8((dna >> 40) % store.shieldsCount()),
            logoPalette1Id: uint8((dna >> 48) % store.logoPalettesCount()),
            logoPalette2Id: uint8((dna >> 56) % store.logoPalettesCount()),
            logo1Id: uint8((dna >> 64) % store.logos1Count()),
            logo2Id: uint8((dna >> 72) % store.logos2Count()),
            logo3Id: uint8((dna >> 80) % store.logos3Count()),
            logo4Id: uint8((dna >> 88) % store.logos4Count())
        });

        return getDnaFromImage(image);
    }

    function getImageFromDna(uint96 dna) public pure returns (TokenTraits memory) {
        return
            TokenTraits({
                bgColorId: uint8(dna),
                googlesColorId: uint8((dna >> 8)),
                crownId: uint8((dna >> 16)),
                doodadId: uint8((dna >> 24)),
                garlandId: uint8((dna >> 32)),
                shieldId: uint8((dna >> 40)),
                logoPalette1Id: uint8((dna >> 48)),
                logoPalette2Id: uint8((dna >> 56)),
                logo1Id: uint8((dna >> 64)),
                logo2Id: uint8((dna >> 72)),
                logo3Id: uint8((dna >> 80)),
                logo4Id: uint8((dna >> 88))
            });
    }

    function getDnaFromImage(TokenTraits memory img) public pure returns (uint96 dna) {
        return
            uint96(img.bgColorId) |
            (uint96(img.googlesColorId) << 8) |
            (uint96(img.crownId) << 16) |
            (uint96(img.doodadId) << 24) |
            (uint96(img.garlandId) << 32) |
            (uint96(img.shieldId) << 40) |
            (uint96(img.logoPalette1Id) << 48) |
            (uint96(img.logoPalette2Id) << 56) |
            (uint96(img.logo1Id) << 64) |
            (uint96(img.logo2Id) << 72) |
            (uint96(img.logo3Id) << 80) |
            (uint96(img.logo4Id) << 88);
    }
}
