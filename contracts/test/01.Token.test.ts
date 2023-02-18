import { expect } from "./chai-setup"
import { setup } from "./utils/setup"

describe("Crest", function () {
  describe("Deployment", function () {
    it("Should be deployed", async function () {
      const { token } = await setup()
      expect(await token.totalSupply()).to.equal(0)
    })

    it("Should mint", async function () {
      const {
        token,
        users: { deployer },
      } = await setup({ provisionParts: true })

      await token.mint()
      expect(await token.totalSupply()).to.equal(1)

      const tokenId = await token.tokenOfOwnerByIndex(deployer, 0)
      expect(tokenId).to.equal(1)
    })

    it("Should not mint by other account", async function () {
      const {
        token,
        signers: { founders },
      } = await setup({ provisionParts: true })

      await expect(token.connect(founders).mint()).to.be.revertedWith(
        "Only auction house contract can mint"
      )
    })

    it("Should burn", async function () {
      const {
        token,
        users: { deployer },
      } = await setup({ provisionParts: true })

      await token.mint()
      expect(await token.totalSupply()).to.equal(1)

      const tokenId = await token.tokenOfOwnerByIndex(deployer, 0)
      expect(tokenId).to.equal(1)

      await token.burn(tokenId)
      expect(await token.totalSupply()).to.equal(0)
    })

    it("Should not burn if not owner", async function () {
      const {
        token,
        users: { deployer },
        signers: { founders },
      } = await setup({ provisionParts: true })

      await token.mint()
      expect(await token.totalSupply()).to.equal(1)

      const tokenId = await token.tokenOfOwnerByIndex(deployer, 0)
      expect(tokenId).to.equal(1)

      await expect(token.connect(founders).burn(tokenId)).to.be.revertedWith(
        "ERC721: caller is not token owner or approved"
      )
    })

    it("Should have dna", async function () {
      const {
        token,
        users: { deployer },
      } = await setup({ provisionParts: true })

      await token.mint()
      expect(await token.totalSupply()).to.equal(1)

      const tokenId = await token.tokenOfOwnerByIndex(deployer, 0)
      const dna = await token.dnaMap(tokenId)

      expect(dna).to.exist
    })
  })
})
