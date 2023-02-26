import { expect } from "./chai-setup"
import { setupFull } from "./utils/setupFull"

import { parseEther } from "ethers/lib/utils"
import { mine, time } from "@nomicfoundation/hardhat-network-helpers"

const ONE_DAY = 86400 * 1000

// founders have 2 tokens
const FIRST_TOKEN_ID = 3

describe("AuctionHouse", function () {
  describe("Deployment", function () {
    it("Should be deployed", async function () {
      const { auctionHouse } = await setupFull()
      expect(await auctionHouse.deployed()).to.exist
    })

    it("Should start", async function () {
      const {
        auctionHouse,
        signers: { user1 },
      } = await setupFull()

      const { tokenId } = await auctionHouse.getAuction()
      expect(tokenId).to.equal(0)
      await auctionHouse.connect(user1).start()

      const { tokenId: newTokenId } = await auctionHouse.getAuction()
      expect(newTokenId).to.equal(FIRST_TOKEN_ID) // 2 founders have a token already
    })

    it("Should not stop before end date", async function () {
      const {
        auctionHouse,
        signers: { user1 },
        hre,
      } = await setupFull()

      await auctionHouse.connect(user1).start()
      await expect(auctionHouse.connect(user1).start()).to.be.revertedWith(
        "Auction hasn't ended yet"
      )

      await hre.network.provider.send("evm_increaseTime", [86400])
      //await helpers.time.increase(86400)
      await expect(auctionHouse.connect(user1).start()).not.to.be.reverted
    })

    it("Should burn if no bid", async function () {
      const {
        auctionHouse,
        token,
        signers: { user1 },
        hre,
      } = await setupFull()

      await expect(token.tokenURI(FIRST_TOKEN_ID)).to.be.revertedWith("This token doesn't exist")

      await auctionHouse.connect(user1).start()
      await expect(token.tokenURI(FIRST_TOKEN_ID)).not.to.be.reverted

      await time.increase(ONE_DAY)
      await auctionHouse.connect(user1).start()

      await expect(token.tokenURI(FIRST_TOKEN_ID)).to.be.revertedWith("This token doesn't exist")
    })

    it("Should not burn if there are bid", async function () {
      const {
        auctionHouse,
        token,
        signers: { user1 },
        hre,
      } = await setupFull()

      await expect(token.tokenURI(FIRST_TOKEN_ID)).to.be.revertedWith("This token doesn't exist")

      await auctionHouse.connect(user1).start()
      await expect(token.tokenURI(FIRST_TOKEN_ID)).not.to.be.reverted

      await auctionHouse.connect(user1).bid({ value: parseEther("1") })
      expect(await token.balanceOf(user1.address)).to.eq(0)

      await time.increase(ONE_DAY)

      await auctionHouse.connect(user1).start()

      expect(await token.balanceOf(user1.address)).to.eq(1)
    })

    it("Should be finished after endTime", async function () {
      const {
        auctionHouse,
        token,
        signers: { user1 },
        hre,
      } = await setupFull()

      await expect(token.tokenURI(FIRST_TOKEN_ID)).to.be.revertedWith("This token doesn't exist")

      await auctionHouse.connect(user1).start()
      await expect(token.tokenURI(FIRST_TOKEN_ID)).not.to.be.reverted

      await auctionHouse.connect(user1).bid({ value: parseEther("1") })
      expect(await token.balanceOf(user1.address)).to.eq(0)

      const state1 = await auctionHouse.getAuction()
      expect(state1.isFinished).to.eq(false)

      await time.increase(ONE_DAY)

      const state2 = await auctionHouse.getAuction()
      expect(state2.isFinished).to.eq(true)
    })
  })
})
