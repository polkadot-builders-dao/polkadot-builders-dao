import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer, founders } = await getNamedAccounts()

  const store = await deployments.get("PBTokenPartsStore")

  const tokenDna = await deploy("PBTokenDna", {
    from: deployer,
    log: true,
  })

  const composer = await deploy("PBTokenComposer", {
    from: deployer,
    log: true,
    libraries: {
      PBTokenDna: tokenDna.address,
    },
  })

  await deploy("PBToken", {
    from: deployer,
    // TODO change 2nd param (auction house)
    args: [store.address, deployer, founders],
    libraries: {
      PBTokenComposer: composer.address,
      PBTokenDna: tokenDna.address,
    },
    log: true,
  })
}
export default func
func.tags = ["PBToken"]
func.dependencies = ["PBTokenPartsStore"]
