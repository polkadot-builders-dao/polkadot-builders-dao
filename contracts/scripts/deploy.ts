import { ethers, deployments, getNamedAccounts } from "hardhat"
import { Crest } from "../typechain-types"
// TODO delete script in favor of hardhat-deploy ?
async function main() {
  // wait for hathat to startup
  // await new Promise((resolve) => setTimeout(resolve, 2_000))
  // // deploy store
  // const PartsStore = await ethers.getContractFactory("PartsStore")
  // const store = await PartsStore.deploy()
  // await store.deployed()
  // console.log(`PartsStore deployed to ${store.address}`)
  // // deploy composer library
  // const TokenGenerator = await ethers.getContractFactory("TokenGenerator")
  // const composer = await TokenGenerator.deploy()
  // await composer.deployed()
  // console.log(`TokenGenerator deployed to ${composer.address}`)
  // // deploy token (NFT)
  // const Crest = await ethers.getContractFactory("Crest", {
  //   libraries: {
  //     TokenGenerator: composer.address,
  //   },
  // })
  // // deploy auction hosue (NFT)
  // const AuctionHouse = await ethers.getContractFactory("AuctionHouse", {
  //   libraries: {
  //     TokenGenerator: composer.address,
  //   },
  // })
  // const token = await Crest.deploy(store.address)
  // await token.deployed()
  // console.log(`Crest deployed to ${token.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
