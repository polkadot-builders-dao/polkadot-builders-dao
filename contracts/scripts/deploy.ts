import { ethers, deployments, getNamedAccounts } from "hardhat"
import { PBToken } from "../typechain-types"
// TODO delete script in favor of hardhat-deploy ?
async function main() {
  // wait for hathat to startup
  // await new Promise((resolve) => setTimeout(resolve, 2_000))
  // // deploy store
  // const PBTokenPartsStore = await ethers.getContractFactory("PBTokenPartsStore")
  // const store = await PBTokenPartsStore.deploy()
  // await store.deployed()
  // console.log(`PBTokenPartsStore deployed to ${store.address}`)
  // // deploy composer library
  // const PBTokenComposer = await ethers.getContractFactory("PBTokenComposer")
  // const composer = await PBTokenComposer.deploy()
  // await composer.deployed()
  // console.log(`PBTokenComposer deployed to ${composer.address}`)
  // // deploy token (NFT)
  // const PBToken = await ethers.getContractFactory("PBToken", {
  //   libraries: {
  //     PBTokenComposer: composer.address,
  //   },
  // })
  // // deploy auction hosue (NFT)
  // const PBAuctionHouse = await ethers.getContractFactory("PBAuctionHouse", {
  //   libraries: {
  //     PBTokenComposer: composer.address,
  //   },
  // })
  // const token = await PBToken.deploy(store.address)
  // await token.deployed()
  // console.log(`PBToken deployed to ${token.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
