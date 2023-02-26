import { expect } from "./chai-setup"
import { BigNumber } from "ethers"
import {
  BG_COLORS,
  CROWNS,
  DOODADS,
  GARLANDS,
  NOOGLES_COLORS,
  REPS,
  LOGO_PALETTES,
  SHIELDS,
  CLASSES,
  TRAITS,
  SKILLS,
} from "../util/defineParts"
import { deployments, ethers } from "hardhat"

describe("PartsStore", function () {
  describe("Deployment", function () {
    it("Should be deployed", async function () {
      const { PartsStore } = await deployments.fixture(["PartsStore_Deploy"])
      const partsStore = await ethers.getContractAt("PartsStore", PartsStore.address)

      expect(partsStore.address).exist
    })

    it("Shouln't generate dna if no bg color defined", async function () {
      const { DnaManager, PartsStore } = await deployments.fixture(["Crest_Deploy"])
      const dnaManager = await ethers.getContractAt("DnaManager", DnaManager.address)

      await expect(
        dnaManager.generateDna(PartsStore.address, BigNumber.from("165189498146486486"))
      ).to.be.revertedWith("No bg colors")
    })

    it("Shouln't generate dna if no noggles color defined", async function () {
      const { DnaManager, PartsStore } = await deployments.fixture(["Crest_Deploy"])
      const partsStore = await ethers.getContractAt("PartsStore", PartsStore.address)
      const dnaManager = await ethers.getContractAt("DnaManager", DnaManager.address)
      const seed = BigNumber.from("165189498146486486")

      await partsStore.addBgColor(BG_COLORS[0])
      await expect(dnaManager.generateDna(partsStore.address, seed)).to.be.revertedWith(
        "No noggles colors"
      )

      await partsStore.addNogglesColor(NOOGLES_COLORS[0])
      await expect(dnaManager.generateDna(partsStore.address, seed)).to.be.revertedWith("No crowns")

      await partsStore.addCrown(CROWNS[0])
      await expect(dnaManager.generateDna(partsStore.address, seed)).to.be.revertedWith(
        "No doodads"
      )

      await partsStore.addDoodad(DOODADS[0])
      await expect(dnaManager.generateDna(partsStore.address, seed)).to.be.revertedWith(
        "No garlands"
      )
      await partsStore.addGarland(GARLANDS[0])

      await expect(dnaManager.generateDna(partsStore.address, seed)).to.be.revertedWith(
        "No shields"
      )

      await partsStore.addShield(SHIELDS[0])
      await expect(dnaManager.generateDna(partsStore.address, seed)).to.be.revertedWith(
        "No logo palettes"
      )

      await partsStore.addQuadrantPalette(LOGO_PALETTES[0])
      await expect(dnaManager.generateDna(partsStore.address, seed)).to.be.revertedWith("No reps")

      await partsStore.addRep(REPS[0])
      await expect(dnaManager.generateDna(partsStore.address, seed)).to.be.revertedWith("No skills")

      await partsStore.addSkill(SKILLS[0])
      await expect(dnaManager.generateDna(partsStore.address, seed)).to.be.revertedWith(
        "No classes"
      )

      await partsStore.addClass(CLASSES[0])
      await expect(dnaManager.generateDna(partsStore.address, seed)).to.be.revertedWith("No traits")

      await partsStore.addTrait(TRAITS[0])
      await expect(dnaManager.generateDna(partsStore.address, seed)).not.to.be.reverted
    })

    it("Should generate accurate dna", async function () {
      const { DnaManager, PartsStore } = await deployments.fixture([
        "Crest_Deploy",
        "PartsStore_Provision",
      ])
      const partsStore = await ethers.getContractAt("PartsStore", PartsStore.address)
      const dnaManager = await ethers.getContractAt("DnaManager", DnaManager.address)

      const dna = await dnaManager.generateDna(
        partsStore.address,
        BigNumber.from("165189498146486486")
      )

      const decoded = await dnaManager.decomposeDna(dna)
      expect(decoded.bgColorId).to.eq(2)
      expect(decoded.nogglesColorId).to.eq(0)
      expect(decoded.crownId).to.eq(4)
      expect(decoded.doodadId).to.eq(3)
      expect(decoded.garlandId).to.eq(0)
      expect(decoded.shieldId).to.eq(0)
      expect(decoded.quadrantPalette1Id).to.eq(0)
      expect(decoded.quadrantPalette2Id).to.eq(9)
      expect(decoded.repId).to.eq(8)
      expect(decoded.skillId).to.eq(3)
      expect(decoded.classId).to.eq(9)
      expect(decoded.traitId).to.eq(3)
    })

    it("Should have valid colors", async function () {
      const { PartsStore } = await deployments.fixture(["Crest_Deploy", "PartsStore_Provision"])
      const partsStore = await ethers.getContractAt("PartsStore", PartsStore.address)

      const firstBgColor = await partsStore.getBgColor(0)
      expect(firstBgColor.name).to.equal("Teal")
      expect(firstBgColor.color).to.equal("#0F3B4A")
    })

    it("Should be able to add more if unlocked", async function () {
      const { PartsStore } = await deployments.fixture(["Crest_Deploy", "PartsStore_Provision"])
      const partsStore = await ethers.getContractAt("PartsStore", PartsStore.address)

      await expect(partsStore.addBgColor(BG_COLORS[0])).not.to.be.reverted
      await expect(partsStore.addNogglesColor(NOOGLES_COLORS[0])).not.to.be.reverted
      await expect(partsStore.addCrown(CROWNS[0])).not.to.be.reverted
      await expect(partsStore.addDoodad(DOODADS[0])).not.to.be.reverted
      await expect(partsStore.addGarland(GARLANDS[0])).not.to.be.reverted
      await expect(partsStore.addShield(SHIELDS[0])).not.to.be.reverted
      await expect(partsStore.addQuadrantPalette(LOGO_PALETTES[0])).not.to.be.reverted
      await expect(partsStore.addRep(REPS[0])).not.to.be.reverted
      await expect(partsStore.addSkill(SKILLS[0])).not.to.be.reverted
      await expect(partsStore.addClass(CLASSES[0])).not.to.be.reverted
      await expect(partsStore.addTrait(TRAITS[0])).not.to.be.reverted
    })

    it("Should not be able to add more if locked", async function () {
      const { PartsStore } = await deployments.fixture(["Crest_Deploy", "PartsStore_Provision"])
      const partsStore = await ethers.getContractAt("PartsStore", PartsStore.address)

      await partsStore.lock()

      await expect(partsStore.addBgColor(BG_COLORS[0])).to.be.revertedWith(
        "PartsStore: contract is locked"
      )
      await expect(partsStore.addNogglesColor(NOOGLES_COLORS[0])).to.be.revertedWith(
        "PartsStore: contract is locked"
      )
      await expect(partsStore.addCrown(CROWNS[0])).to.be.revertedWith(
        "PartsStore: contract is locked"
      )
      await expect(partsStore.addDoodad(DOODADS[0])).to.be.revertedWith(
        "PartsStore: contract is locked"
      )
      await expect(partsStore.addGarland(GARLANDS[0])).to.be.revertedWith(
        "PartsStore: contract is locked"
      )
      await expect(partsStore.addShield(SHIELDS[0])).to.be.revertedWith(
        "PartsStore: contract is locked"
      )
      await expect(partsStore.addQuadrantPalette(LOGO_PALETTES[0])).to.be.revertedWith(
        "PartsStore: contract is locked"
      )
      await expect(partsStore.addRep(REPS[0])).to.be.revertedWith("PartsStore: contract is locked")
      await expect(partsStore.addSkill(SKILLS[0])).to.be.revertedWith(
        "PartsStore: contract is locked"
      )
      await expect(partsStore.addClass(CLASSES[0])).to.be.revertedWith(
        "PartsStore: contract is locked"
      )
      await expect(partsStore.addTrait(TRAITS[0])).to.be.revertedWith(
        "PartsStore: contract is locked"
      )
    })

    it("Should have all parts", async function () {
      const { PartsStore } = await deployments.fixture(["Crest_Deploy", "PartsStore_Provision"])
      const partsStore = await ethers.getContractAt("PartsStore", PartsStore.address)

      const checkCollectionParts = (parts: string[], collection: { name: string }[]) => {
        for (let i = 0; i < collection.length; i++) expect(parts[i]).to.eq(collection[i].name)
      }

      const allParts = await partsStore.getAllParts()
      checkCollectionParts(allParts.bgColors, BG_COLORS as { name: string }[])
      checkCollectionParts(allParts.nogglesColors, NOOGLES_COLORS as { name: string }[])
      checkCollectionParts(allParts.crowns, CROWNS as { name: string }[])
      checkCollectionParts(allParts.doodads, DOODADS as { name: string }[])
      checkCollectionParts(allParts.garlands, GARLANDS as { name: string }[])
      checkCollectionParts(allParts.shields, SHIELDS as { name: string }[])
      checkCollectionParts(allParts.quadrantPalettes, LOGO_PALETTES as { name: string }[])
      checkCollectionParts(allParts.reps, REPS as { name: string }[])
      checkCollectionParts(allParts.skills, SKILLS as { name: string }[])
      checkCollectionParts(allParts.classes, CLASSES as { name: string }[])
      checkCollectionParts(allParts.traits, TRAITS as { name: string }[])
    })
  })
})
