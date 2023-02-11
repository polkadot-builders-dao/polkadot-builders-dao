// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../interfaces/IPBTokenPartsStore.sol";
import {Base64} from "base64-sol/base64.sol";
import {PBTokenDna} from "./PBTokenDna.sol";

// @custom:security-contact contact@polkadot-builders.xyz
library PBTokenComposer {
    struct ImageParts {
        IPBTokenPartsStore.Color bgColor;
        IPBTokenPartsStore.Color googlesColor;
        IPBTokenPartsStore.ImagePart crown;
        IPBTokenPartsStore.ImagePart decoration;
        IPBTokenPartsStore.ImagePart garland;
        IPBTokenPartsStore.ImagePart shield;
        IPBTokenPartsStore.Palette logoPalette1;
        IPBTokenPartsStore.Palette logoPalette2;
        IPBTokenPartsStore.ImagePart logo1;
        IPBTokenPartsStore.ImagePart logo2;
        IPBTokenPartsStore.ImagePart logo3;
        IPBTokenPartsStore.ImagePart logo4;
    }

    function getImageParts(
        address storeAddress,
        uint96 dna
    ) public view returns (ImageParts memory) {
        IPBTokenPartsStore store = IPBTokenPartsStore(storeAddress);
        PBTokenDna.TokenTraits memory traits = PBTokenDna.getImageFromDna(dna);

        return
            ImageParts({
                bgColor: store.getBgColor(traits.bgColorId),
                googlesColor: store.getGooglesColor(traits.googlesColorId),
                crown: store.getCrown(traits.crownId),
                decoration: store.getDecoration(traits.decorationId),
                garland: store.getGarland(traits.garlandId),
                shield: store.getShield(traits.shieldId),
                logoPalette1: store.getLogoPalette(traits.logoPalette1Id),
                logoPalette2: store.getLogoPalette(traits.logoPalette2Id),
                logo1: store.getLogo1(traits.logo1Id),
                logo2: store.getLogo2(traits.logo2Id),
                logo3: store.getLogo3(traits.logo3Id),
                logo4: store.getLogo4(traits.logo4Id)
            });
    }

    function getTokenMetadata(
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
            '{"trait_type": "Googles","value":"', parts.googlesColor.name, '"},',
            '{"trait_type": "Crown","value":"', parts.crown.name, '"},',
            '{"trait_type": "Decoration","value":"', parts.decoration.name, '"},'
        );

        // prettier-ignore
        string memory logoPalettes = string.concat(
            '{"trait_type": "Palette 1","value":"', parts.logoPalette1.name, '"},',
            '{"trait_type": "Palette 2","value":"', parts.logoPalette2.name, '"},'
        );

        // prettier-ignore
        string memory logos = string.concat(
            '{"trait_type": "Logo 1","value":"', parts.logo1.name, '"},',
            '{"trait_type": "Logo 2","value":"', parts.logo2.name, '"},',
            '{"trait_type": "Logo 3","value":"', parts.logo3.name, '"},',
            '{"trait_type": "Logo 4","value":"', parts.logo4.name, '"}]}'
        );

        // prettier-ignore
        return  string.concat(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            string.concat(
                                '{"name":"Polkadot Builders #', Strings.toString(tokenId), '", ', 
                                '"description":"This is my description", ',
                                '"image": "', getSvgDataUri(parts) , '"',
                                attributes,
                                logoPalettes,
                                logos
                            )
                        )
                    )
                );
    }

    function getSvgDataUri(ImageParts memory parts) private pure returns (string memory) {
        // prettier-ignore
        string memory logos = string.concat(
            // quadrants top left and bottom right
            '<g fill="', parts.logoPalette1.secondary, '"><path d="M128.353 137.01V248.778H247.604V102.688L128.353 137.01Z" /><path d="M257.17 258.355V405.343L258.325 404.86C263.116 402.858 375.594 354.852 375.594 271.798V258.373H257.17V258.355Z" /></g>',
            '<g fill="', parts.logoPalette1.primary, '">', parts.logo1.svg, parts.logo4.svg, "</g>",
            // quadrants bottom left and top right
            '<g fill="', parts.logoPalette2.secondary, '"><path d="M128.353 258.355V271.781C128.353 354.748 240.848 402.841 245.64 404.86L247.604 405.688V258.355H128.353Z" /><path d="M375.611 137.01L257.17 102.912V248.778H375.611V137.01Z" /></g>',
            '<g fill="', parts.logoPalette2.primary, '">', parts.logo2.svg, parts.logo3.svg, "</g>"
        );

        // prettier-ignore
        string memory googles = string.concat(
            '<path d="M284.867 88.6242H265.995V126.398H284.867V88.6242Z" fill="white"/><path d="M303.74 88.6242H284.867V127.485H303.74V88.6242Z" fill="#231F20"/><path d="M219.787 89.2109H201.224V126.381H219.787V89.2109Z" fill="white"/><path d="M239.556 88.3826H219.804V128.503H239.556V88.3826Z" fill="#231F20"/>',
            '<path fill="', parts.googlesColor.color, '" d="M257.032 79.8753V98.5637H247.725V79.8753H192.003V98.5637H154.775V129.418L163.91 126.795V107.709H192.003V135.664H247.725V107.709H257.032V135.664H312.754V79.8753H257.032ZM238.366 126.398H201.241V89.2282H238.366V126.398ZM303.395 126.398H266.27V89.2282H303.395V126.398Z"/>'
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
                                parts.decoration.svg,
                                googles,
                                '</svg>'
                            )
                        )
                    )
                );
    }
}
