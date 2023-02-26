// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import {IPartsStore} from "./interfaces/IPartsStore.sol";

/**
 * @title PartsStore contract
 * @dev Contract for managing various image parts of Polkadot Builders Crests such as colors, image parts, and palettes
 */
contract PartsStore is IPartsStore, Ownable {
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

    /**
     * @dev Returns the count of background colors
     * @return the count of background colors
     */
    function bgColorsCount() external view returns (uint256) {
        return bgColors.length;
    }

    /**
     * @dev Returns the count of noggles colors
     * @return the count of noggles colors
     */
    function nogglesColorsCount() external view returns (uint256) {
        return nogglesColors.length;
    }

    /**
     * @dev Returns the count of crowns
     * @return the count of crowns
     */
    function crownsCount() external view returns (uint256) {
        return crowns.length;
    }

    /**
     * @dev Returns the count of doodads
     * @return the count of doodads
     */
    function doodadsCount() external view returns (uint256) {
        return doodads.length;
    }

    /**
     * @dev Returns the count of garlands
     * @return the count of garlands
     */
    function garlandsCount() external view returns (uint256) {
        return garlands.length;
    }

    /**
     * @dev Returns the count of shields
     * @return the count of shields
     */
    function shieldsCount() external view returns (uint256) {
        return shields.length;
    }

    /**
     * @dev Returns the count of quadrant palettes
     * @return the count of quadrant palettes
     */
    function quadrantPalettesCount() external view returns (uint256) {
        return quadrantPalettes.length;
    }

    /**
     * @dev Returns the count of reps
     * @return the count of reps
     */
    function repsCount() external view returns (uint256) {
        return reps.length;
    }

    /**
     * @dev Returns the count of skills
     * @return the count of skills
     */
    function skillsCount() external view returns (uint256) {
        return skills.length;
    }

    /**
     * @dev Returns the count of classes
     * @return the count of classes
     */
    function classesCount() external view returns (uint256) {
        return classes.length;
    }

    /**
     * @dev Returns the count of traits
     * @return the count of traits
     */
    function traitsCount() external view returns (uint256) {
        return traits.length;
    }

    /**
     * @dev Returns the background color at the given index
     * @param id the index of the background color to retrieve
     * @return the background color at the given index
     */
    function getBgColor(uint8 id) external view returns (Color memory) {
        return bgColors[id];
    }

    /**
     * @dev Returns the noggles color at the given index
     * @param id the index of the noggles color to retrieve
     * @return the noggles color at the given index
     */
    function getNogglesColor(uint8 id) external view returns (Color memory) {
        return nogglesColors[id];
    }

    /**
     * @dev Returns the crown at the given index
     * @param id the index of the crown to retrieve
     * @return the crown at the given index
     */
    function getCrown(uint8 id) external view returns (ImagePart memory) {
        return crowns[id];
    }

    /**
     * @dev Returns the doodad at the given index
     * @param id the index of the doodad to retrieve
     * @return the doodad at the given index
     */
    function getDoodad(uint8 id) external view returns (ImagePart memory) {
        return doodads[id];
    }

    /**
     * @dev Returns the garland at the given index
     * @param id the index of the garland to retrieve
     * @return the garland at the given index
     */
    function getGarland(uint8 id) external view returns (ImagePart memory) {
        return garlands[id];
    }

    /**
     * @dev Returns the shield at the given index
     * @param id the index of the shield to retrieve
     * @return the shield at the given index
     */
    function getShield(uint8 id) external view returns (ImagePart memory) {
        return shields[id];
    }

    /**
     * @dev Returns the quadrant palette at the given index
     * @param id the index of the quadrant palette to retrieve
     * @return the quadrant palette at the given index
     */
    function getQuadrantPalette(uint8 id) external view returns (Palette memory) {
        return quadrantPalettes[id];
    }

    /**
     * @dev Returns the rep at the given index
     * @param id the index of the rep to retrieve
     * @return the rep at the given index
     */
    function getRep(uint8 id) external view returns (ImagePart memory) {
        return reps[id];
    }

    /**
     * @dev Returns the skill at the given index
     * @param id the index of the skill to retrieve
     * @return the skill at the given index
     */
    function getSkill(uint8 id) external view returns (ImagePart memory) {
        return skills[id];
    }

    /**
     * @dev Returns the image part with the given ID.
     * @param id The ID of the image part to retrieve.
     * @return The ImagePart struct containing information about the image part.
     */
    function getClass(uint8 id) external view returns (ImagePart memory) {
        return classes[id];
    }

    /**
     * @dev Returns the image trait with the given ID.
     * @param id The ID of the image trait to retrieve.
     * @return The ImagePart struct containing information about the image trait.
     */
    function getTrait(uint8 id) external view returns (ImagePart memory) {
        return traits[id];
    }

    /**
     * @dev Adds a new background color to the list of available background colors.
     * @param color The color to add.
     * @notice Only the contract owner can call this function.
     * @dev Throws an error if the number of background colors is already at the maximum (255).
     */
    function addBgColor(Color calldata color) external onlyOwner {
        require(bgColors.length < 255, "To many entries");
        bgColors.push(color);
    }

    /**
     * @dev Adds a new Noggles color to the list of available Noggles colors.
     * @param color The color to add.
     * @notice Only the contract owner can call this function.
     * @dev Throws an error if the number of Noggles colors is already at the maximum (255).
     */
    function addNogglesColor(Color calldata color) external onlyOwner {
        require(nogglesColors.length < 255, "To many entries");
        nogglesColors.push(color);
    }

    /**
     * @dev Adds a new crown to the list of available crowns.
     * @param part The crown to add.
     * @notice Only the contract owner can call this function.
     * @dev Throws an error if the number of crowns is already at the maximum (255).
     */
    function addCrown(ImagePart calldata part) external onlyOwner {
        require(crowns.length < 255, "To many entries");
        crowns.push(part);
    }

    /**
     * @dev Adds a new doodad to the list of available doodads.
     * @param part The doodad to add.
     * @notice Only the contract owner can call this function.
     * @dev Throws an error if the number of doodads is already at the maximum (255).
     */
    function addDoodad(ImagePart calldata part) external onlyOwner {
        require(doodads.length < 255, "To many entries");
        doodads.push(part);
    }

    /**
     * @dev Adds a new garland to the list of available garlands.
     * @param part The garland to add.
     * @notice Only the contract owner can call this function.
     * @dev Throws an error if the number of garlands is already at the maximum (255).
     */
    function addGarland(ImagePart calldata part) external onlyOwner {
        require(garlands.length < 255, "To many entries");
        garlands.push(part);
    }

    /**
     * @dev Adds a new shield to the list of available shields.
     * @param part The shield to add.
     * @notice Only the contract owner can call this function.
     * @dev Throws an error if the number of shields is already at the maximum (255).
     */
    function addShield(ImagePart calldata part) external onlyOwner {
        require(shields.length < 255, "To many entries");
        shields.push(part);
    }

    /**
     * @dev Adds a new quadrant palette to the list of available quadrant palettes.
     * @param palette The quadrant palette to add.
     * @notice Only the contract owner can call this function.
     * @dev Throws an error if the number of quadrant palettes is already at the maximum (255).
     */
    function addQuadrantPalette(Palette calldata palette) external onlyOwner {
        require(quadrantPalettes.length < 255, "To many entries");
        quadrantPalettes.push(palette);
    }

    /**
     * @dev Adds a new rep to the list of available reps.
     * @param part The rep to add.
     * @notice Only the contract owner can call this function.
     * @dev Throws an error if the number of reps is already at the maximum (255).
     */
    function addRep(ImagePart calldata part) external onlyOwner {
        require(reps.length < 255, "To many entries");
        reps.push(part);
    }

    /**
     * @dev Adds a new skill to the list of available skills.
     * @param part The skill to add.
     * @notice Only the contract owner can call this function.
     * @dev Throws an error if the number of skills is already at the maximum (255).
     */
    function addSkill(ImagePart calldata part) external onlyOwner {
        require(skills.length < 255, "To many entries");
        skills.push(part);
    }

    /**
     * @dev Adds a new class to the list of available classes.
     * @param part The class to add.
     * @notice Only the contract owner can call this function.
     * @dev Throws an error if the number of classes is already at the maximum (255).
     */
    function addClass(ImagePart calldata part) external onlyOwner {
        require(classes.length < 255, "To many entries");
        classes.push(part);
    }

    /**
     * @dev Adds a new trait to the list of available traits.
     * @param part The trait to add.
     * @notice Only the contract owner can call this function.
     * @dev Throws an error if the number of traits is already at the maximum (255).
     */
    function addTrait(ImagePart calldata part) external onlyOwner {
        require(traits.length < 255, "To many entries");
        traits.push(part);
    }

    /**
     * @dev Returns the names of available colors.
     * @return The names of available colors.
     */
    function getColorNames(Color[] memory colors) private pure returns (string[] memory) {
        string[] memory names = new string[](colors.length);
        for (uint256 i = 0; i < colors.length; i++) {
            names[i] = colors[i].name;
        }
        return names;
    }

    /**
     * @dev Returns the names of available color palettes.
     * @return The names of available color palettess.
     */
    function getPaletteNames(Palette[] memory palettes) private pure returns (string[] memory) {
        string[] memory names = new string[](palettes.length);
        for (uint256 i = 0; i < palettes.length; i++) {
            names[i] = palettes[i].name;
        }
        return names;
    }

    /**
     * @dev Returns the names of available image parts.
     * @return The names of available image parts.
     */
    function getImagePartNames(ImagePart[] memory parts) private pure returns (string[] memory) {
        string[] memory names = new string[](parts.length);
        for (uint256 i = 0; i < parts.length; i++) {
            names[i] = parts[i].name;
        }
        return names;
    }

    /**
     * @dev Returns all available parts.
     * @return All available parts.
     */
    function getAllParts() external view returns (AllParts memory) {
        return
            AllParts(
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
