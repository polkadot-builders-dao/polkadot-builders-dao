import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, ethers } = hre

  const Crest = await deployments.get("Crest")
  const crest = await ethers.getContractAt("Crest", Crest.address)

  console.log("Configuring auction house")
  const AuctionHouse = await deployments.get("AuctionHouse")
  const auctionHouse = await ethers.getContractAt("AuctionHouse", AuctionHouse.address)

  // set practical defaults for dev & test, real value will be defined by governance before launch
  await (await auctionHouse.setDuration(180)).wait()
  await (await auctionHouse.setExtendedDuration(60)).wait()
  await (await auctionHouse.setMinFirstBid(ethers.utils.parseEther("0.1"))).wait()

  console.log("associating auction house with crest")
  await (await crest.setAuctionHouse(AuctionHouse.address)).wait()
}
export default func
func.tags = ["AuctionHouse_Config_PROD"]
func.dependencies = ["FounderMints_PROD", "AuctionHouse_Deploy"]
