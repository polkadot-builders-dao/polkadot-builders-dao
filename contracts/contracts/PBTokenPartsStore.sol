// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {IPBTokenPartsStore} from "./interfaces/IPBTokenPartsStore.sol";

contract PBTokenPartsStore is IPBTokenPartsStore, Ownable {
    Color[] public bgColors;
    Color[] public nogglesColors;
    ImagePart[] public crowns;
    ImagePart[] public doodads;
    ImagePart[] public garlands;
    ImagePart[] public shields;
    Palette[] public quadrantPalettes;
    ImagePart[] public reps;
    ImagePart[] public skills;
    ImagePart[] public classes;
    ImagePart[] public traits;

    function bgColorsCount() external view returns (uint256) {
        return bgColors.length;
    }

    function nogglesColorsCount() external view returns (uint256) {
        return nogglesColors.length;
    }

    function crownsCount() external view returns (uint256) {
        return crowns.length;
    }

    function doodadsCount() external view returns (uint256) {
        return doodads.length;
    }

    function garlandsCount() external view returns (uint256) {
        return garlands.length;
    }

    function shieldsCount() external view returns (uint256) {
        return shields.length;
    }

    function quadrantPalettesCount() external view returns (uint256) {
        return quadrantPalettes.length;
    }

    function repsCount() external view returns (uint256) {
        return reps.length;
    }

    function skillsCount() external view returns (uint256) {
        return skills.length;
    }

    function classesCount() external view returns (uint256) {
        return classes.length;
    }

    function traitsCount() external view returns (uint256) {
        return traits.length;
    }

    function getBgColor(uint8 id) external view returns (Color memory) {
        return bgColors[id];
    }

    function getNogglesColor(uint8 id) external view returns (Color memory) {
        return nogglesColors[id];
    }

    function getCrown(uint8 id) external view returns (ImagePart memory) {
        return crowns[id];
    }

    function getDoodad(uint8 id) external view returns (ImagePart memory) {
        return doodads[id];
    }

    function getGarland(uint8 id) external view returns (ImagePart memory) {
        return garlands[id];
    }

    function getShield(uint8 id) external view returns (ImagePart memory) {
        return shields[id];
    }

    function getQuadrantPalette(uint8 id) external view returns (Palette memory) {
        return quadrantPalettes[id];
    }

    function getRep(uint8 id) external view returns (ImagePart memory) {
        return reps[id];
    }

    function getSkill(uint8 id) external view returns (ImagePart memory) {
        return skills[id];
    }

    function getClass(uint8 id) external view returns (ImagePart memory) {
        return classes[id];
    }

    function getTrait(uint8 id) external view returns (ImagePart memory) {
        return traits[id];
    }

    function addBgColor(Color calldata color) external onlyOwner {
        //    require(bgColors.length < 255, "To many entries");
        bgColors.push(color);
    }

    function addNogglesColor(Color calldata color) external onlyOwner {
        //    require(nogglesColors.length < 255, "To many entries");
        nogglesColors.push(color);
    }

    function addCrown(ImagePart calldata part) external onlyOwner {
        //   require(crowns.length < 255, "To many entries");
        crowns.push(part);
    }

    function addDoodad(ImagePart calldata part) external onlyOwner {
        //   require(doodads.length < 255, "To many entries");
        doodads.push(part);
    }

    function addGarland(ImagePart calldata part) external onlyOwner {
        //  require(garlands.length < 255, "To many entries");
        garlands.push(part);
    }

    function addShield(ImagePart calldata part) external onlyOwner {
        //   require(shields.length < 255, "To many entries");
        shields.push(part);
    }

    function addQuadrantPalette(Palette calldata palette) external onlyOwner {
        //    require(quadrantPalettes.length < 255, "To many entries");
        quadrantPalettes.push(palette);
    }

    function addRep(ImagePart calldata part) external onlyOwner {
        //    require(reps.length < 255, "To many entries");
        reps.push(part);
    }

    function addSkill(ImagePart calldata part) external onlyOwner {
        //    require(skills.length < 255, "To many entries");
        skills.push(part);
    }

    function addClass(ImagePart calldata part) external onlyOwner {
        //    require(classes.length < 255, "To many entries");
        classes.push(part);
    }

    function addTrait(ImagePart calldata part) external onlyOwner {
        //   require(traits.length < 255, "To many entries");
        traits.push(part);
    }

    function getColorNames(Color[] memory colors) private pure returns (string[] memory) {
        string[] memory names = new string[](colors.length);
        for (uint256 i = 0; i < colors.length; i++) {
            names[i] = colors[i].name;
        }
        return names;
    }

    function getPaletteNames(Palette[] memory palettes) private pure returns (string[] memory) {
        string[] memory names = new string[](palettes.length);
        for (uint256 i = 0; i < palettes.length; i++) {
            names[i] = palettes[i].name;
        }
        return names;
    }

    function getImagePartNames(ImagePart[] memory parts) private pure returns (string[] memory) {
        string[] memory names = new string[](parts.length);
        for (uint256 i = 0; i < parts.length; i++) {
            names[i] = parts[i].name;
        }
        return names;
    }

    function getAllParts() external view returns (AvailableParts memory) {
        return
            AvailableParts(
                getColorNames(bgColors),
                getColorNames(nogglesColors),
                getImagePartNames(crowns),
                getImagePartNames(doodads),
                getImagePartNames(garlands),
                getImagePartNames(shields),
                getPaletteNames(quadrantPalettes),
                getImagePartNames(reps),
                getImagePartNames(skills),
                getImagePartNames(classes),
                getImagePartNames(traits)
            );
    }
}
