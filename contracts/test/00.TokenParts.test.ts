import { expect } from "./chai-setup"
import { BigNumber } from "ethers"
import { PBToken, PBTokenComposer, PBTokenDna, PBTokenPartsStore } from "../typechain-types"
import {
  BG_COLORS,
  CROWNS,
  DECORATIONS,
  defineParts,
  GARLANDS,
  GOOGLES_COLORS,
  LOGOS1,
  LOGO_PALETTES,
  SHIELDS,
} from "../util/defineParts"
import { setup } from "./utils/setup"

// const setup = deployments.createFixture(async () => {
//   await deployments.fixture("PBToken")
//   const { deployer } = await getNamedAccounts()
//   const contracts = {
//     tokenPartsContract: <PBTokenPartsStore>await ethers.getContract("PBTokenPartsStore"),
//     tokenDna: <PBTokenDna>await ethers.getContract("PBTokenDna"),
//     composer: <PBTokenComposer>await ethers.getContract("PBTokenComposer"),
//     token: <PBToken>await ethers.getContract("PBToken"),
//   }
//   //const users = await setupUsers(await getUnnamedAccounts(), contracts)
//   return {
//     ...contracts,
//     // users,
//     //deployer: await setupUser(simpleERC20Beneficiary, contracts),
//   }
// })

describe("PBTokenPartsStore", function () {
  // async function deployFixture() {
  //   const [owner, account1, account2] = await ethers.getSigners()

  //   const PBTokenPartsStore = await ethers.getContractFactory("PBTokenPartsStore")
  //   const tokenPartsContract = (await PBTokenPartsStore.deploy()) as PBTokenPartsStore

  //   const PBTokenDna = await ethers.getContractFactory("PBTokenDna")
  //   const tokenDna = (await PBTokenDna.deploy()) as PBTokenDna

  //   return {
  //     tokenPartsContract,
  //     tokenDna,
  //     owner,
  //     account1,
  //     account2,
  //   }
  // }

  // async function deployParts(partsContract:PBTokenParts) {
  //   const [owner, account1, account2] = await ethers.getSigners()

  //   const PBTokenParts = await ethers.getContractFactory("PBTokenParts")
  //   const tokenPartsContract = await PBTokenParts.deploy()

  //   return {
  //     tokenPartsContract,
  //     owner,
  //     account1,
  //     account2,
  //   }
  // }

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

    it("Shouln't generate dna if no googles color defined", async function () {
      const { tokenPartsContract, tokenDna } = await setup()
      const seed = BigNumber.from("165189498146486486")

      await tokenPartsContract.addBgColor(BG_COLORS[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).to.be.revertedWith(
        "No googles colors"
      )

      await tokenPartsContract.addGooglesColor(GOOGLES_COLORS[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).to.be.revertedWith(
        "No crowns"
      )

      await tokenPartsContract.addCrown(CROWNS[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).to.be.revertedWith(
        "No doodads"
      )

      await tokenPartsContract.addDoodad(DECORATIONS[0])
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

      await tokenPartsContract.addRep(LOGOS1[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).to.be.revertedWith(
        "No skills"
      )

      await tokenPartsContract.addSkill(LOGOS1[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).to.be.revertedWith(
        "No logos3"
      )

      await tokenPartsContract.addLogo3(LOGOS1[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).to.be.revertedWith(
        "No logos4"
      )

      await tokenPartsContract.addLogo4(LOGOS1[0])
      await expect(tokenDna.generateDna(tokenPartsContract.address, seed)).not.to.be.reverted
    })

    it("Should generate accurate dna", async function () {
      const { tokenPartsContract, tokenDna } = await setup({ provisionParts: true })

      const dna = await tokenDna.generateDna(
        tokenPartsContract.address,
        BigNumber.from("165189498146486486")
      )

      const decoded = await tokenDna.getImageFromDna(dna)
      expect(decoded.bgColorId).to.eq(2)
      expect(decoded.googlesColorId).to.eq(2)
      expect(decoded.crownId).to.eq(4)
      expect(decoded.doodadId).to.eq(3)
      expect(decoded.garlandId).to.eq(0)
      expect(decoded.shieldId).to.eq(0)
      expect(decoded.quadrantPalette1Id).to.eq(0)
      expect(decoded.quadrantPalette2Id).to.eq(9)
      expect(decoded.repId).to.eq(6)
      expect(decoded.skillId).to.eq(3)
      expect(decoded.logo3Id).to.eq(3)
      expect(decoded.logo4Id).to.eq(6)
    })

    it("Should have valid colors", async function () {
      const { tokenPartsContract } = await setup({ provisionParts: true })

      const firstBgColor = await tokenPartsContract.bgColors(0)
      expect(firstBgColor.name).to.equal("#0F3B4A")
      expect(firstBgColor.color).to.equal("#0F3B4A")
    })
  })
})
