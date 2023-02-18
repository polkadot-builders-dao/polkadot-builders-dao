// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface IPBTokenPartsStore {
    struct Color {
        string name;
        string color;
    }

    struct Palette {
        string name;
        string primary;
        string secondary;
    }

    struct ImagePart {
        string name;
        string svg;
    }

    struct AvailableTraits {
        string[] bgColors;
        string[] googlesColors;
        string[] crowns;
        string[] doodads;
        string[] garlands;
        string[] shields;
        string[] logoPalettes;
        string[] logos1;
        string[] logos2;
        string[] logos3;
        string[] logos4;
    }

    function bgColorsCount() external view returns (uint256);

    function googlesColorsCount() external view returns (uint256);

    function crownsCount() external view returns (uint256);

    function doodadsCount() external view returns (uint256);

    function garlandsCount() external view returns (uint256);

    function shieldsCount() external view returns (uint256);

    function logoPalettesCount() external view returns (uint256);

    function logos1Count() external view returns (uint256);

    function logos2Count() external view returns (uint256);

    function logos3Count() external view returns (uint256);

    function logos4Count() external view returns (uint256);

    function getBgColor(uint8 id) external view returns (Color memory);

    function getGooglesColor(uint8 id) external view returns (Color memory);

    function getCrown(uint8 id) external view returns (ImagePart memory);

    function getDoodad(uint8 id) external view returns (ImagePart memory);

    function getGarland(uint8 id) external view returns (ImagePart memory);

    function getShield(uint8 id) external view returns (ImagePart memory);

    function getLogoPalette(uint8 id) external view returns (Palette memory);

    function getLogo1(uint8 id) external view returns (ImagePart memory);

    function getLogo2(uint8 id) external view returns (ImagePart memory);

    function getLogo3(uint8 id) external view returns (ImagePart memory);

    function getLogo4(uint8 id) external view returns (ImagePart memory);

    function addBgColor(Color calldata color) external;

    function addGooglesColor(Color calldata color) external;

    function addCrown(ImagePart calldata part) external;

    function addDoodad(ImagePart calldata part) external;

    function addGarland(ImagePart calldata part) external;

    function addShield(ImagePart calldata part) external;

    function addLogoPalette(Palette calldata palette) external;

    function addLogo1(ImagePart calldata part) external;

    function addLogo2(ImagePart calldata part) external;

    function addLogo3(ImagePart calldata part) external;

    function addLogo4(ImagePart calldata part) external;

    function getAllTraits() external returns (AvailableTraits memory);
}
