import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { PBToken } from "../typechain-types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const tokenDeployment = await deployments.get("PBToken")

  const token = (await ethers.getContractAt("PBToken", tokenDeployment.address)) as PBToken

  const deployed = await deploy("PBAuctionHouse", {
    from: deployer,
    args: [token.address, deployer],
    log: true,
  })

  await token.setAuctionHouse(deployed.address)
}
export default func
func.tags = ["PBAuctionHouse"]
func.dependencies = ["ProvisionParts"]
