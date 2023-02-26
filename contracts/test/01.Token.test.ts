import { expect } from "./chai-setup"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import {
  ERC721Enumerable__factory,
  ERC721__factory,
  IERC165__factory,
  IERC721Enumerable__factory,
  IERC721__factory,
} from "../typechain-types"
import { getInterfaceId } from "../util/getInterfaceId"

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

    it("Should have a contractURI", async function () {
      const { Crest } = await deployments.fixture(["Crest_Deploy", "PartsStore_Provision"])
      const crest = await ethers.getContractAt("Crest", Crest.address)

      expect(await crest.contractURI()).to.eq(
        "https://polkadot-builders.xyz/external/crest-contracts-uri.json"
      )

      await crest.setContractURI("another url")
      expect(await crest.contractURI()).to.eq("another url")
    })

    it("Should support standard interfaces", async function () {
      const { Crest } = await deployments.fixture(["Crest_Deploy", "PartsStore_Provision"])
      const crest = await ethers.getContractAt("Crest", Crest.address)

      // supports IERC165 Interface
      const ierc165 = IERC165__factory.createInterface()
      const iderc165 = getInterfaceId(ierc165)
      expect(await crest.supportsInterface(iderc165.toHexString()), "IERC165").to.eq(true)

      // supports IERC721 Interface
      const erc721 = IERC721__factory.createInterface()
      const iderc721 = getInterfaceId(erc721).xor(iderc165)
      console.log(iderc721.toHexString())
      expect(await crest.supportsInterface(iderc721.toHexString()), "IERC721").to.eq(true)

      // supports IERC721Enumerable Interface
      const erc721enumerable = IERC721Enumerable__factory.createInterface()
      const iderc721enum = getInterfaceId(erc721enumerable).xor(iderc165).xor(iderc721)
      expect(await crest.supportsInterface(iderc721enum.toHexString()), "IERC721Enumerable").to.eq(
        true
      )
    })
  })
})
