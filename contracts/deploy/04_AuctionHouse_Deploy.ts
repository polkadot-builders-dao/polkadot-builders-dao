import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.time("DEPLOYMENT AuctionHouse_Deploy")
  const { deployments, getNamedAccounts, ethers } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const crestDeployment = await deployments.get("Crest")
  const crest = await ethers.getContractAt("Crest", crestDeployment.address)

  await deploy("AuctionHouse", {
    from: deployer,
    args: [crest.address, deployer],
    log: true,
  })

  console.timeEnd("DEPLOYMENT AuctionHouse_Deploy")
}
export default func
func.tags = ["AuctionHouse_Deploy"]
func.dependencies = ["Crest_Deploy"]
