import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, ethers } = hre

  const Crest = await deployments.get("Crest")
  const crest = await ethers.getContractAt("Crest", Crest.address)

  const AuctionHouse = await deployments.get("AuctionHouse")

  await (await crest.setAuctionHouse(AuctionHouse.address)).wait()
}
export default func
func.tags = ["AuctionHouse_Config_TEST"]
func.dependencies = ["FounderMints_TEST", "AuctionHouse_Deploy"]
