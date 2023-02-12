import { ethers, deployments, getNamedAccounts } from "hardhat"

async function main() {
  const { deployer } = await getNamedAccounts()

  const depAuctionHouse = await deployments.get("PBAuctionHouse")

  const auctionHouse = await ethers.getContractAt("PBAuctionHouse", depAuctionHouse.address)

  console.log("auction house", await auctionHouse.getConfig(), deployer)
  await auctionHouse.setDuration(180)
  await auctionHouse.setExtendedDuration(60)
  await auctionHouse.setMinFirstBid(ethers.utils.parseEther("0.1"))
  await auctionHouse.setTreasury("0x5C9EBa3b10E45BF6db77267B40B95F3f91Fc5f67")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
