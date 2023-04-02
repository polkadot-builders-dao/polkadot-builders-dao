import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

// TODO add another deployment to transfer ownership of all contracts to the governor
// most of the code for that is here as comments

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const crestDeployment = await deployments.get("Crest")

  await deploy("DaoGovernor", {
    from: deployer,
    args: [crestDeployment.address],
    log: true,
  })
}
export default func
func.tags = ["DaoGovernor_Deploy"]
func.dependencies = ["Crest_Deploy"]
