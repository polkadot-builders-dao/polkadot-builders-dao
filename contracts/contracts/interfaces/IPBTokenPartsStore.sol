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

    struct AvailableParts {
        string[] bgColors;
        string[] googlesColors;
        string[] crowns;
        string[] doodads;
        string[] garlands;
        string[] shields;
        string[] quadrantPalettes;
        string[] reps;
        string[] skills;
        string[] classes;
        string[] traits;
    }

    function bgColorsCount() external view returns (uint256);

    function googlesColorsCount() external view returns (uint256);

    function crownsCount() external view returns (uint256);

    function doodadsCount() external view returns (uint256);

    function garlandsCount() external view returns (uint256);

    function shieldsCount() external view returns (uint256);

    function quadrantPalettesCount() external view returns (uint256);

    function repsCount() external view returns (uint256);

    function skillsCount() external view returns (uint256);

    function classesCount() external view returns (uint256);

    function traitsCount() external view returns (uint256);

    function getBgColor(uint8 id) external view returns (Color memory);

    function getGooglesColor(uint8 id) external view returns (Color memory);

    function getCrown(uint8 id) external view returns (ImagePart memory);

    function getDoodad(uint8 id) external view returns (ImagePart memory);

    function getGarland(uint8 id) external view returns (ImagePart memory);

    function getShield(uint8 id) external view returns (ImagePart memory);

    function getQuadrantPalette(uint8 id) external view returns (Palette memory);

    function getRep(uint8 id) external view returns (ImagePart memory);

    function getSkill(uint8 id) external view returns (ImagePart memory);

    function getClass(uint8 id) external view returns (ImagePart memory);

    function getTrait(uint8 id) external view returns (ImagePart memory);

    function addBgColor(Color calldata color) external;

    function addGooglesColor(Color calldata color) external;

    function addCrown(ImagePart calldata part) external;

    function addDoodad(ImagePart calldata part) external;

    function addGarland(ImagePart calldata part) external;

    function addShield(ImagePart calldata part) external;

    function addQuadrantPalette(Palette calldata palette) external;

    function addRep(ImagePart calldata part) external;

    function addSkill(ImagePart calldata part) external;

    function addClass(ImagePart calldata part) external;

    function addTrait(ImagePart calldata part) external;

    function getAllParts() external returns (AvailableParts memory);
}
