import { expect } from "./chai-setup"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"

import { parseEther } from "ethers/lib/utils"
import { time } from "@nomicfoundation/hardhat-network-helpers"
import { FOUNDERS_MINTS } from "../util/contants"

const ONE_DAY = 86400 //* 1000

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

    it("Should be able to change treasury address", async function () {
      const { AuctionHouse, Crest } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const crest = await ethers.getContractAt("Crest", Crest.address)
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const { user1, user2, deployer, founders, dao } = await getNamedAccounts()
      const user1Signer = await ethers.getSigner(user1)

      // After deploy, the treasury is the deployer account
      const config = await auctionHouse.getConfig()
      expect(config.treasury, "Initial treasury address").to.eq(deployer)
      const balanceStartDeployer = await ethers.provider.getBalance(deployer)
      const balanceStartTreasury = await ethers.provider.getBalance(dao)

      const ONE_ETHER = parseEther("1")

      await auctionHouse.connect(user1Signer).start()
      await auctionHouse.connect(user1Signer).bid({ value: ONE_ETHER })
      await time.increase(ONE_DAY)
      await auctionHouse.connect(user1Signer).start()

      const balanceAfterDeployer = await ethers.provider.getBalance(deployer)
      expect(balanceAfterDeployer.sub(balanceStartDeployer)).to.eq(ONE_ETHER)

      // change treasury address
      auctionHouse.setTreasury(dao)
      const newConfig = await auctionHouse.getConfig()
      expect(newConfig.treasury, "New treasury address").to.eq(dao)

      await auctionHouse.connect(user1Signer).bid({ value: ONE_ETHER })
      await time.increase(ONE_DAY)
      await auctionHouse.connect(user1Signer).start()

      const balanceAfterTreasury = await ethers.provider.getBalance(dao)
      expect(balanceAfterTreasury.sub(balanceStartTreasury)).to.eq(ONE_ETHER)
    })

    it("Should change GLMR precompile contract address", async function () {
      const { AuctionHouse } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const { user1 } = await getNamedAccounts()

      const startConfig = await auctionHouse.getConfig()
      expect(startConfig.glmr, "Initial ERC20 address").to.eq(
        "0x0000000000000000000000000000000000000802"
      )

      await auctionHouse.setGLMR(user1)
      const afterConfig = await auctionHouse.getConfig()
      expect(afterConfig.glmr, "Changed ERC20 address").to.eq(user1)
    })

    it("Should respect duration", async function () {
      const { AuctionHouse } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const config = await auctionHouse.getConfig()
      expect(config.duration.eq(ONE_DAY)).to.be.true

      await auctionHouse.start()

      await time.increase(ONE_DAY - 10)
      const auction1 = await auctionHouse.getAuction()
      expect(auction1.isFinished, "Finishes to early").to.be.false

      await time.increase(20)
      const auction2 = await auctionHouse.getAuction()
      expect(auction2.isFinished, "Finishes to late").to.be.true
    })

    it("Should respect modified duration", async function () {
      const { AuctionHouse } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const NEW_DURATION = 5 * 60 // 5 mins

      await auctionHouse.setDuration(NEW_DURATION)

      const config = await auctionHouse.getConfig()
      expect(config.duration.eq(NEW_DURATION)).to.be.true

      await auctionHouse.start()

      await time.increase(NEW_DURATION - 10)
      const auction1 = await auctionHouse.getAuction()
      expect(auction1.isFinished, "Finishes to early").to.be.false

      await time.increase(20)
      const auction2 = await auctionHouse.getAuction()
      expect(auction2.isFinished, "Finishes to late").to.be.true
    })

    it("Should respect extended duration", async function () {
      const { AuctionHouse } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const TEN_MINUTES = 10 * 60

      const config = await auctionHouse.getConfig()
      expect(config.extendedDuration.eq(TEN_MINUTES)).to.be.true

      await auctionHouse.start()

      await time.increase(ONE_DAY - 10)
      const auction1 = await auctionHouse.getAuction()
      const endTime1 = auction1.endTime

      await auctionHouse.bid({ value: parseEther("1") })

      const auction2 = await auctionHouse.getAuction()
      const endTime2 = auction2.endTime

      expect(endTime2.sub(endTime1).toNumber(), "Unexpected time difference").to.be.lessThanOrEqual(
        TEN_MINUTES
      )
      expect(
        endTime2.sub(endTime1).toNumber(),
        "Unexpected time difference"
      ).to.be.greaterThanOrEqual(TEN_MINUTES - 10)

      await time.increase(20)
      const auction3 = await auctionHouse.getAuction()
      expect(auction3.isFinished, "Finishes to early").to.be.false

      await time.increase(TEN_MINUTES)
      const auction4 = await auctionHouse.getAuction()
      expect(auction4.isFinished, "Finishes to late").to.be.true
    })

    it("Should change extended duration", async function () {
      const { AuctionHouse } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const FIVE_MINUTES = 5 * 60

      await auctionHouse.setExtendedDuration(FIVE_MINUTES)

      const config = await auctionHouse.getConfig()
      expect(config.extendedDuration.eq(FIVE_MINUTES)).to.be.true

      await auctionHouse.start()

      await time.increase(ONE_DAY - 10)
      const auction1 = await auctionHouse.getAuction()
      const endTime1 = auction1.endTime

      await auctionHouse.bid({ value: parseEther("1") })

      const auction2 = await auctionHouse.getAuction()
      const endTime2 = auction2.endTime

      expect(endTime2.sub(endTime1).toNumber(), "Unexpected time difference").to.be.lessThanOrEqual(
        FIVE_MINUTES
      )
      expect(
        endTime2.sub(endTime1).toNumber(),
        "Unexpected time difference"
      ).to.be.greaterThanOrEqual(FIVE_MINUTES - 10)

      await time.increase(20)
      const auction3 = await auctionHouse.getAuction()
      expect(auction3.isFinished, "Finishes to early").to.be.false

      await time.increase(FIVE_MINUTES)
      const auction4 = await auctionHouse.getAuction()
      expect(auction4.isFinished, "Finishes to late").to.be.true
    })

    it("Should respect min first bid", async function () {
      const { AuctionHouse } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const MIN_FIRST_BID = parseEther("1")

      const config = await auctionHouse.getConfig()
      expect(config.minFirstBid.eq(MIN_FIRST_BID)).to.be.true

      await auctionHouse.start()

      const auction = await auctionHouse.getAuction()
      expect(auction.minBid.eq(MIN_FIRST_BID)).to.be.true

      await expect(auctionHouse.bid({ value: parseEther("0.9") })).to.be.revertedWith(
        "Bid amount is too low"
      )
      await expect(auctionHouse.bid({ value: parseEther("1.0") })).not.to.be.reverted
    })

    it("Should change min bid", async function () {
      const { AuctionHouse } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const MIN_FIRST_BID = parseEther("0.5")

      await auctionHouse.setMinFirstBid(MIN_FIRST_BID)

      const config = await auctionHouse.getConfig()
      expect(config.minFirstBid.eq(MIN_FIRST_BID)).to.be.true

      await auctionHouse.start()

      const auction = await auctionHouse.getAuction()
      expect(auction.minBid.eq(MIN_FIRST_BID)).to.be.true

      await expect(auctionHouse.bid({ value: parseEther("0.4") })).to.be.revertedWith(
        "Bid amount is too low"
      )
      await expect(auctionHouse.bid({ value: parseEther("0.5") })).not.to.be.reverted
    })

    it("Should respect min bid increment", async function () {
      const { AuctionHouse } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const MIN_BID_INC = ethers.BigNumber.from(1)

      const config = await auctionHouse.getConfig()
      expect(config.minBidIncrementPercent.eq(MIN_BID_INC)).to.be.true

      await auctionHouse.start()
      auctionHouse.bid({ value: parseEther("1.0") })

      await expect(auctionHouse.bid({ value: parseEther("1.005") })).to.be.revertedWith(
        "Bid amount is too low"
      )
      await expect(auctionHouse.bid({ value: parseEther("1.01") })).not.to.be.reverted
    })

    it("Should change min bid increment", async function () {
      const { AuctionHouse } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const MIN_BID_INC = ethers.BigNumber.from(2)
      await auctionHouse.setMinBidIncrementPercent(MIN_BID_INC)

      const config = await auctionHouse.getConfig()
      expect(config.minBidIncrementPercent.eq(MIN_BID_INC)).to.be.true

      await auctionHouse.start()
      auctionHouse.bid({ value: parseEther("1.0") })

      await expect(auctionHouse.bid({ value: parseEther("1.01") })).to.be.revertedWith(
        "Bid amount is too low"
      )
      await expect(auctionHouse.bid({ value: parseEther("1.02") })).not.to.be.reverted
    })

    it("Should respect bid conditions", async function () {
      const { AuctionHouse } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      await expect(auctionHouse.bid({ value: parseEther("1") })).to.be.revertedWith(
        "Auction has ended"
      )

      await auctionHouse.start()
      await expect(auctionHouse.bid({ value: parseEther("1") })).not.to.be.reverted

      await time.increase(ONE_DAY + 10)
      await expect(auctionHouse.bid({ value: parseEther("2") })).to.be.revertedWith(
        "Auction has ended"
      )
    })

    it("Should reimburse previous bidder", async function () {
      const { AuctionHouse } = await deployments.fixture([
        "FoundersMint_TEST",
        "AuctionHouse_Config_TEST",
      ])
      const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

      const { user1, user2 } = await getNamedAccounts()
      const user1Signer = await ethers.getSigner(user1)
      const user2Signer = await ethers.getSigner(user2)

      const BID_USER1 = parseEther("1.5")
      await auctionHouse.start()
      await auctionHouse.connect(user1Signer).bid({ value: BID_USER1 })
      const balanceUser1Before = await user1Signer.getBalance()

      await auctionHouse.connect(user2Signer).bid({ value: BID_USER1.mul(2) })

      const balanceUser1After = await user1Signer.getBalance()
      expect(balanceUser1After.sub(balanceUser1Before).toString()).to.eq(BID_USER1.toString())
    })
  })
})
