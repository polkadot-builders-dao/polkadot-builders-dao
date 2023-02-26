// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "../interfaces/IPartsStore.sol";
import {Base64} from "base64-sol/base64.sol";
import {DnaManager} from "./DnaManager.sol";

/**
 * @title TokenGenerator
 * @notice Library to generate token URIs for Polkadot Builder Crests NFTs.
 * @custom:security-contact contact@polkadot-builders.xyz
 */
library TokenGenerator {
    struct ImageParts {
        IPartsStore.Color bgColor;
        IPartsStore.Color nogglesColor;
        IPartsStore.ImagePart crown;
        IPartsStore.ImagePart doodad;
        IPartsStore.ImagePart garland;
        IPartsStore.ImagePart shield;
        IPartsStore.Palette quadrantPalette1;
        IPartsStore.Palette quadrantPalette2;
        IPartsStore.ImagePart rep;
        IPartsStore.ImagePart skill;
        IPartsStore.ImagePart class;
        IPartsStore.ImagePart trait;
    }

    /**
     * @dev Loads the parts to display in the SVG, for a given DNA
     * @param storeAddress Address of the parts store.
     * @param dna The DNA of the NFT.
     * @return The the parts to display in the SVG.
     */
    function getImageParts(
        address storeAddress,
        uint96 dna
    ) public view returns (ImageParts memory) {
        IPartsStore store = IPartsStore(storeAddress);
        DnaManager.DecomposedDna memory decomposedDna = DnaManager.decomposeDna(dna);

        return
            ImageParts({
                bgColor: store.getBgColor(decomposedDna.bgColorId),
                nogglesColor: store.getNogglesColor(decomposedDna.nogglesColorId),
                crown: store.getCrown(decomposedDna.crownId),
                doodad: store.getDoodad(decomposedDna.doodadId),
                garland: store.getGarland(decomposedDna.garlandId),
                shield: store.getShield(decomposedDna.shieldId),
                quadrantPalette1: store.getQuadrantPalette(decomposedDna.quadrantPalette1Id),
                quadrantPalette2: store.getQuadrantPalette(decomposedDna.quadrantPalette2Id),
                rep: store.getRep(decomposedDna.repId),
                skill: store.getSkill(decomposedDna.skillId),
                class: store.getClass(decomposedDna.classId),
                trait: store.getTrait(decomposedDna.traitId)
            });
    }

    /**
     * @dev Generates a token URI for an Polkadot Builders Crest NFT based on a provided DNA.
     * @param storeAddress Address of the parts store.
     * @param tokenId The ID of the NFT.
     * @param dna The DNA of the NFT.
     * @return The generated token URI as a string.
     */
    function generateTokenURI(
        address storeAddress,
        uint256 tokenId,
        uint96 dna
    ) public view returns (string memory) {
        ImageParts memory parts = getImageParts(storeAddress, dna);

        // @dev splitting to prevent "stack to deep" error, need to process 16 variables maximum at a time

        // prettier-ignore
        string memory attributes = string.concat(
            ', "attributes": [',
            '{"trait_type": "Background","value":"', parts.bgColor.name, '"},',
            '{"trait_type": "Noggles","value":"', parts.nogglesColor.name, '"},',
            '{"trait_type": "Crown","value":"', parts.crown.name, '"},',
            '{"trait_type": "Doodad","value":"', parts.doodad.name, '"},'
        );

        // prettier-ignore
        string memory quadrantPalettes = string.concat(
            '{"trait_type": "Quadrant Palette 1","value":"', parts.quadrantPalette1.name, '"},',
            '{"trait_type": "Quadrant Palette 2","value":"', parts.quadrantPalette2.name, '"},'
        );

        // prettier-ignore
        string memory logos = string.concat(
            '{"trait_type": "Rep","value":"', parts.rep.name, '"},',
            '{"trait_type": "Skill","value":"', parts.skill.name, '"},',
            '{"trait_type": "Class","value":"', parts.class.name, '"},',
            '{"trait_type": "Trait","value":"', parts.trait.name, '"}]}'
        );

        // prettier-ignore
        return  string.concat(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            string.concat(
                                '{"name":"Polkadot Builder Crest #', Strings.toString(tokenId), '", ', 
                                '"description":"Official mark of a genuine Polkadot Builder.", ',
                                '"image": "', getSvgDataUri(parts) , '"',
                                attributes,
                                quadrantPalettes,
                                logos
                            )
                        )
                    )
                );
    }

    /**
     * @dev Generates the SVG data URI for an Polkadot Builders Crest NFT based on a provided DNA.
     * @param parts The parts to embed into the NFT.
     * @return The generated SVG data URI as a string.
     */
    function getSvgDataUri(ImageParts memory parts) private pure returns (string memory) {
        // prettier-ignore
        string memory logos = string.concat(
            // quadrants top left and bottom right
            '<g fill="', parts.quadrantPalette1.secondary, '"><path d="M128.353 137.01V248.778H247.604V102.688L128.353 137.01Z" /><path d="M257.17 258.355V405.343L258.325 404.86C263.116 402.858 375.594 354.852 375.594 271.798V258.373H257.17V258.355Z" /></g>',
            '<g fill="', parts.quadrantPalette1.primary, '">', parts.rep.svg, parts.trait.svg, "</g>",
            // quadrants bottom left and top right
            '<g fill="', parts.quadrantPalette2.secondary, '"><path d="M128.353 258.355V271.781C128.353 354.748 240.848 402.841 245.64 404.86L247.604 405.688V258.355H128.353Z" /><path d="M375.611 137.01L257.17 102.912V248.778H375.611V137.01Z" /></g>',
            '<g fill="', parts.quadrantPalette2.primary, '">', parts.skill.svg, parts.class.svg, "</g>"
        );

        // prettier-ignore
        string memory noggles = string.concat(
            '<path d="M284.867 88.6242H265.995V126.398H284.867V88.6242Z" fill="white"/><path d="M303.74 88.6242H284.867V127.485H303.74V88.6242Z" fill="#231F20"/><path d="M219.787 89.2109H201.224V126.381H219.787V89.2109Z" fill="white"/><path d="M239.556 88.3826H219.804V128.503H239.556V88.3826Z" fill="#231F20"/>',
            '<path fill="', parts.nogglesColor.color, '" d="M257.032 79.8753V98.5637H247.725V79.8753H192.003V98.5637H154.775V129.418L163.91 126.795V107.709H192.003V135.664H247.725V107.709H257.032V135.664H312.754V79.8753H257.032ZM238.366 126.398H201.241V89.2282H238.366V126.398ZM303.395 126.398H266.27V89.2282H303.395V126.398Z"/>'
        );

        // prettier-ignore
        return string.concat(
                    "data:image/svg+xml;base64,",
                    Base64.encode(
                        bytes(
                            string.concat(
                                '<svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">',
                                //background
                                '<path d="M500 0H0V500H500" fill="', parts.bgColor.color, '" />',
                                parts.crown.svg,
                                parts.shield.svg,
                                logos,
                                parts.garland.svg,
                                parts.doodad.svg,
                                noggles,
                                '</svg>'
                            )
                        )
                    )
                );
    }
}
