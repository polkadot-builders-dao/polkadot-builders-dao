import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.time("DEPLOYMENT PartsStore")
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  await deploy("PartsStore", {
    from: deployer,
    log: true,
  })
  console.timeEnd("DEPLOYMENT PartsStore")
}
export default func
func.tags = ["PartsStore_Deploy"]
