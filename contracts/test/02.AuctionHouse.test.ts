import { expect } from "./chai-setup"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"

import { parseEther } from "ethers/lib/utils"
import { time } from "@nomicfoundation/hardhat-network-helpers"
import { FOUNDERS_MINTS } from "../util/contants"

const ONE_DAY = 86400 * 1000

// founders have 2 tokens
const FIRST_TOKEN_ID = FOUNDERS_MINTS.length + 1

describe("AuctionHouse", function () {
  describe("Deployment", function () {
    it("Should be deployed", async function () {
      const { AuctionHouse } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)
      expect(await auctionHouse.deployed()).to.exist
    })

    it("Should start", async function () {
      const { AuctionHouse } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const { user1 } = await getNamedAccounts()
      const user1Signer = await ethers.getSigner(user1)

      const { tokenId } = await auctionHouse.getAuction()
      expect(tokenId).to.equal(0)
      await auctionHouse.connect(user1Signer).start()

      const { tokenId: newTokenId } = await auctionHouse.getAuction()
      expect(newTokenId).to.equal(FIRST_TOKEN_ID) // 2 founders have a token already
    })

    it("Should not stop before end date", async function () {
      const { AuctionHouse } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const { user1 } = await getNamedAccounts()
      const user1Signer = await ethers.getSigner(user1)

      await auctionHouse.connect(user1Signer).start()
      await expect(auctionHouse.connect(user1Signer).start()).to.be.revertedWith(
        "Auction hasn't ended yet"
      )

      await network.provider.send("evm_increaseTime", [86400])
      await expect(auctionHouse.connect(user1Signer).start()).not.to.be.reverted
    })

    it("Should revert if doesn't exist", async function () {
      const { Crest } = await deployments.fixture(["FoundersMint_TEST", "AuctionHouse_Config_TEST"])
      const crest = await ethers.getContractAt("Crest", Crest.address)
      await expect(crest.tokenURI(50)).to.be.revertedWith("This token doesn't exist")
    })

    it("Should not rever if exists", async function () {
      const { Crest } = await deployments.fixture(["FoundersMint_TEST", "AuctionHouse_Config_TEST"])
      const crest = await ethers.getContractAt("Crest", Crest.address)
      // warning this is long on js vm
      await expect(crest.tokenURI(1)).not.to.be.reverted
    })

    it("Should burn if no bid", async function () {
      const { AuctionHouse, Crest } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const crest = await ethers.getContractAt("Crest", Crest.address)
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const { user1 } = await getNamedAccounts()
      const user1Signer = await ethers.getSigner(user1)

      await expect(crest.ownerOf(FIRST_TOKEN_ID)).to.be.revertedWith("ERC721: invalid token ID")

      await auctionHouse.connect(user1Signer).start()
      expect(await crest.ownerOf(FIRST_TOKEN_ID)).to.eq(auctionHouse.address)

      await time.increase(ONE_DAY)
      await auctionHouse.connect(user1Signer).start()

      await expect(crest.ownerOf(FIRST_TOKEN_ID)).to.be.revertedWith("ERC721: invalid token ID")
    })

    it("Should not burn if there are bid", async function () {
      const { AuctionHouse, Crest } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const crest = await ethers.getContractAt("Crest", Crest.address)
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const { user1 } = await getNamedAccounts()
      const user1Signer = await ethers.getSigner(user1)

      await expect(crest.ownerOf(FIRST_TOKEN_ID)).to.be.revertedWith("ERC721: invalid token ID")

      await auctionHouse.connect(user1Signer).start()
      expect(await crest.ownerOf(FIRST_TOKEN_ID)).to.eq(auctionHouse.address)
      await auctionHouse.connect(user1Signer).bid({ value: parseEther("1") })
      expect(await crest.ownerOf(FIRST_TOKEN_ID)).to.eq(auctionHouse.address)

      await time.increase(ONE_DAY)

      await auctionHouse.connect(user1Signer).start()

      expect(await crest.ownerOf(FIRST_TOKEN_ID)).to.eq(user1Signer.address)
    })

    it("Should be finished after endTime", async function () {
      const { AuctionHouse, Crest } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const crest = await ethers.getContractAt("Crest", Crest.address)
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const { user1 } = await getNamedAccounts()
      const user1Signer = await ethers.getSigner(user1)

      await expect(crest.ownerOf(FIRST_TOKEN_ID)).to.be.revertedWith("ERC721: invalid token ID")

      await auctionHouse.connect(user1Signer).start()
      expect(await crest.ownerOf(FIRST_TOKEN_ID)).to.eq(auctionHouse.address)

      await auctionHouse.connect(user1Signer).bid({ value: parseEther("1") })
      expect(await crest.ownerOf(FIRST_TOKEN_ID)).to.eq(auctionHouse.address)
      expect(await crest.balanceOf(user1Signer.address)).to.eq(0)

      const state1 = await auctionHouse.getAuction()
      expect(state1.isFinished).to.eq(false)

      await time.increase(ONE_DAY)

      const state2 = await auctionHouse.getAuction()
      expect(state2.isFinished).to.eq(true)
    })

    it("Should send rewards to founders", async function () {
      const { AuctionHouse, Crest } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const crest = await ethers.getContractAt("Crest", Crest.address)
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const { user1, deployer, founders } = await getNamedAccounts()
      console.log({ user1, deployer, founders, auctionHouse: auctionHouse.address })
      const user1Signer = await ethers.getSigner(user1)

      for (let i = 0; i < 20; i++) {
        await auctionHouse.connect(user1Signer).start()
        await auctionHouse.connect(user1Signer).bid({ value: parseEther("1") })
        await time.increase(ONE_DAY)
      }

      expect(await crest.ownerOf(10)).to.eq(founders)
      expect(await crest.ownerOf(20)).to.eq(founders)
    })

    it("Should be able to change founders address", async function () {
      const { AuctionHouse, Crest } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const crest = await ethers.getContractAt("Crest", Crest.address)
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const { user1, user2, deployer, founders } = await getNamedAccounts()
      console.log({ user1, deployer, founders, auctionHouse: auctionHouse.address })
      const user1Signer = await ethers.getSigner(user1)

      for (let i = 0; i < 10; i++) {
        await auctionHouse.connect(user1Signer).start()
        await auctionHouse.connect(user1Signer).bid({ value: parseEther("1") })
        await time.increase(ONE_DAY)
      }

      expect(await crest.ownerOf(10)).to.eq(founders)

      // change address
      await crest.setFounders(user2)

      for (let i = 0; i < 10; i++) {
        await auctionHouse.connect(user1Signer).start()
        await auctionHouse.connect(user1Signer).bid({ value: parseEther("1") })
        await time.increase(ONE_DAY)
      }

      expect(await crest.ownerOf(20)).to.eq(user2)
    })
  })
})
