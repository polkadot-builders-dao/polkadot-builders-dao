import { expect } from "./chai-setup"
import { deployments, ethers, getNamedAccounts } from "hardhat"

describe("Crest", function () {
  describe("Deployment", function () {
    it("Should be deployed", async function () {
      const { Crest } = await deployments.fixture(["Crest_Deploy", "PartsStore_Provision"])
      const crest = await ethers.getContractAt("Crest", Crest.address)
      expect(await crest.totalSupply()).to.equal(0)
    })

    it("Should mint", async function () {
      const { Crest } = await deployments.fixture(["Crest_Deploy", "PartsStore_Provision"])
      const crest = await ethers.getContractAt("Crest", Crest.address)

      const { deployer } = await getNamedAccounts()

      await crest.mint()
      expect(await crest.totalSupply()).to.equal(1)

      const tokenId = await crest.tokenOfOwnerByIndex(deployer, 0)
      expect(tokenId).to.equal(1)
    })

    it("Should not mint by other account", async function () {
      const { Crest } = await deployments.fixture(["Crest_Deploy", "PartsStore_Provision"])
      const crest = await ethers.getContractAt("Crest", Crest.address)

      const { founders } = await getNamedAccounts()
      const foundersSigner = await ethers.getSigner(founders)

      await expect(crest.connect(foundersSigner).mint()).to.be.revertedWith(
        "Only auction house contract can mint"
      )
    })

    it("Should burn", async function () {
      const { Crest } = await deployments.fixture(["Crest_Deploy", "PartsStore_Provision"])
      const crest = await ethers.getContractAt("Crest", Crest.address)
      const { deployer } = await getNamedAccounts()

      await crest.mint()
      expect(await crest.totalSupply()).to.equal(1)

      const tokenId = await crest.tokenOfOwnerByIndex(deployer, 0)
      expect(tokenId).to.equal(1)

      await crest.burn(tokenId)
      expect(await crest.totalSupply()).to.equal(0)
    })

    it("Should not burn if not owner", async function () {
      const { Crest } = await deployments.fixture(["Crest_Deploy", "PartsStore_Provision"])
      const crest = await ethers.getContractAt("Crest", Crest.address)
      const { deployer, founders } = await getNamedAccounts()
      const foundersSigner = await ethers.getSigner(founders)

      await crest.mint()
      expect(await crest.totalSupply()).to.equal(1)

      const tokenId = await crest.tokenOfOwnerByIndex(deployer, 0)
      expect(tokenId).to.equal(1)

      await expect(crest.connect(foundersSigner).burn(tokenId)).to.be.revertedWith(
        "ERC721: caller is not token owner or approved"
      )
    })

    it("Should have dna", async function () {
      const { Crest } = await deployments.fixture(["Crest_Deploy", "PartsStore_Provision"])
      const crest = await ethers.getContractAt("Crest", Crest.address)
      const { deployer } = await getNamedAccounts()

      await crest.mint()
      expect(await crest.totalSupply()).to.equal(1)

      const tokenId = await crest.tokenOfOwnerByIndex(deployer, 0)
      const dna = await crest.dnaMap(tokenId)

      expect(dna).to.exist
    })
  })
})
