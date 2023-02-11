import { ethers, deployments, getNamedAccounts } from "hardhat"
import { PBToken } from "../typechain-types"

async function main() {
  const { deployer } = await getNamedAccounts()

  const depAuctionHouse = await deployments.get("PBAuctionHouse")

  const auctionHouse = await ethers.getContractAt("PBAuctionHouse", depAuctionHouse.address)

  console.log("auction house", await auctionHouse.getConfig(), deployer)
  await auctionHouse.setDuration(60)
  await auctionHouse.setExtendedDuration(30)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
