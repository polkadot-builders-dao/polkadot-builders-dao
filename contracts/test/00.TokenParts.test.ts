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
import { setup } from "./utils/setup"

describe("PBTokenPartsStore", function () {
  describe("Deployment", function () {
    it("Should be deployed", async function () {
      const { tokenPartsContract } = await setup()
      expect(await tokenPartsContract.deployed()).exist
    })

    it("Shouln't generate dna if no bg color defined", async function () {
      const { tokenPartsContract, tokenDna } = await setup()

      await expect(
        tokenDna.generateDna(tokenPartsContract.address, BigNumber.from("165189498146486486"))
      ).to.be.revertedWith("No bg colors")
    })

    it("Shouln't generate dna if no noggles color defined", async function () {
      const { tokenPartsContract, tokenDna } = await setup()
      const seed = BigNumber.from("165189498146486486")

      await tokenPartsContract.addBgColor(BG_COLORS[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).to.be.revertedWith(
        "No noggles colors"
      )

      await tokenPartsContract.addNogglesColor(NOOGLES_COLORS[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).to.be.revertedWith(
        "No crowns"
      )

      await tokenPartsContract.addCrown(CROWNS[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).to.be.revertedWith(
        "No doodads"
      )

      await tokenPartsContract.addDoodad(DOODADS[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).to.be.revertedWith(
        "No garlands"
      )
      await tokenPartsContract.addGarland(GARLANDS[0])

      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).to.be.revertedWith(
        "No shields"
      )

      await tokenPartsContract.addShield(SHIELDS[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).to.be.revertedWith(
        "No logo palettes"
      )

      await tokenPartsContract.addQuadrantPalette(LOGO_PALETTES[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).to.be.revertedWith(
        "No reps"
      )

      await tokenPartsContract.addRep(REPS[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).to.be.revertedWith(
        "No skills"
      )

      await tokenPartsContract.addSkill(SKILLS[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).to.be.revertedWith(
        "No classes"
      )

      await tokenPartsContract.addClass(CLASSES[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).to.be.revertedWith(
        "No traits"
      )

      await tokenPartsContract.addTrait(TRAITS[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).not.to.be.reverted
    })

    it("Should generate accurate dna", async function () {
      const { tokenPartsContract, tokenDna } = await setup({ provisionParts: true })

      const dna = await tokenDna.generateDna(
        tokenPartsContract.address,
        BigNumber.from("165189498146486486")
      )

      const decoded = await tokenDna.getImageFromDna(dna)
      console.log(decoded)
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
      const { tokenPartsContract } = await setup({ provisionParts: true })

      const firstBgColor = await tokenPartsContract.bgColors(0)
      expect(firstBgColor.name).to.equal("Green")
      expect(firstBgColor.color).to.equal("#0F3B4A")
    })
  })
})
