// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IPartsStore} from "../interfaces/IPartsStore.sol";

/**
 * @title DnaManager
 * @notice Library to generate and manipulate DNA of Polkadot Builder Crests NFTs.
 */
library DnaManager {
    struct DecomposedDna {
        uint8 bgColorId;
        uint8 nogglesColorId;
        uint8 crownId;
        uint8 doodadId;
        uint8 garlandId;
        uint8 shieldId;
        uint8 quadrantPalette1Id;
        uint8 quadrantPalette2Id;
        uint8 repId;
        uint8 skillId;
        uint8 classId;
        uint8 traitId;
    }

    /**
     * @dev Generates a unique DNA for an NFT based on a provided seed.
     * @param storeAddress Address of the parts store.
     * @param seed The seed to generate the DNA.
     * @return The generated DNA as a uint96 value.
     */
    function generateDna(address storeAddress, uint256 seed) public view returns (uint96) {
        IPartsStore store = IPartsStore(storeAddress);

        require(store.bgColorsCount() > 0, "No bg colors");
        require(store.nogglesColorsCount() > 0, "No noggles colors");
        require(store.crownsCount() > 0, "No crowns");
        require(store.doodadsCount() > 0, "No doodads");
        require(store.garlandsCount() > 0, "No garlands");
        require(store.shieldsCount() > 0, "No shields");
        require(store.quadrantPalettesCount() > 0, "No logo palettes");
        require(store.repsCount() > 0, "No reps");
        require(store.skillsCount() > 0, "No skills");
        require(store.classesCount() > 0, "No classes");
        require(store.traitsCount() > 0, "No traits");

        // not truely random but it won't matter, we want a unique dna based on any number, usually a timestamp
        uint rand = uint(keccak256(abi.encodePacked(seed)));

        return reduceDna(storeAddress, uint96(rand));
    }

    /**
     * @dev Reduces the given DNA to its corresponding traits.
     * @param storeAddress Address of the parts store.
     * @param dna The DNA to reduce.
     * @return The reduced DNA as a uint96 value.
     */
    function reduceDna(address storeAddress, uint96 dna) private view returns (uint96) {
        IPartsStore store = IPartsStore(storeAddress);

        DecomposedDna memory image = DecomposedDna({
            bgColorId: uint8(dna % store.bgColorsCount()),
            nogglesColorId: uint8((dna >> 8) % store.nogglesColorsCount()),
            crownId: uint8((dna >> 16) % store.crownsCount()),
            doodadId: uint8((dna >> 24) % store.doodadsCount()),
            garlandId: uint8((dna >> 32) % store.garlandsCount()),
            shieldId: uint8((dna >> 40) % store.shieldsCount()),
            quadrantPalette1Id: uint8((dna >> 48) % store.quadrantPalettesCount()),
            quadrantPalette2Id: uint8((dna >> 56) % store.quadrantPalettesCount()),
            repId: uint8((dna >> 64) % store.repsCount()),
            skillId: uint8((dna >> 72) % store.skillsCount()),
            classId: uint8((dna >> 80) % store.classesCount()),
            traitId: uint8((dna >> 88) % store.traitsCount())
        });

        return composeDna(image);
    }

    /**
     * @dev Gets the traits of a given DNA.
     * @param dna The DNA to get the traits from.
     * @return The traits of the DNA.
     */
    function decomposeDna(uint96 dna) public pure returns (DecomposedDna memory) {
        return
            DecomposedDna({
                bgColorId: uint8(dna),
                nogglesColorId: uint8((dna >> 8)),
                crownId: uint8((dna >> 16)),
                doodadId: uint8((dna >> 24)),
                garlandId: uint8((dna >> 32)),
                shieldId: uint8((dna >> 40)),
                quadrantPalette1Id: uint8((dna >> 48)),
                quadrantPalette2Id: uint8((dna >> 56)),
                repId: uint8((dna >> 64)),
                skillId: uint8((dna >> 72)),
                classId: uint8((dna >> 80)),
                traitId: uint8((dna >> 88))
            });
    }

    /**
     * @dev Gets the DNA of a given traits.
     * @param decomposedDna The traits to get the DNA from.
     * @return The DNA of the traits.
     */
    function composeDna(DecomposedDna memory decomposedDna) public pure returns (uint96) {
        return
            uint96(decomposedDna.bgColorId) |
            (uint96(decomposedDna.nogglesColorId) << 8) |
            (uint96(decomposedDna.crownId) << 16) |
            (uint96(decomposedDna.doodadId) << 24) |
            (uint96(decomposedDna.garlandId) << 32) |
            (uint96(decomposedDna.shieldId) << 40) |
            (uint96(decomposedDna.quadrantPalette1Id) << 48) |
            (uint96(decomposedDna.quadrantPalette2Id) << 56) |
            (uint96(decomposedDna.repId) << 64) |
            (uint96(decomposedDna.skillId) << 72) |
            (uint96(decomposedDna.classId) << 80) |
            (uint96(decomposedDna.traitId) << 88);
    }
}
