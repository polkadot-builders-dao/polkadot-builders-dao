import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const store = await deployments.get("PartsStore")

  const tokenDna = await deploy("DnaManager", {
    from: deployer,
    log: true,
  })

  const composer = await deploy("TokenGenerator", {
    from: deployer,
    log: true,
    libraries: {
      DnaManager: tokenDna.address,
    },
  })

  await deploy("Crest", {
    from: deployer,
    args: [store.address, deployer, deployer],
    libraries: {
      TokenGenerator: composer.address,
      DnaManager: tokenDna.address,
    },
    log: true,
  })
}
export default func
func.tags = ["Crest"]
func.dependencies = ["PartsStore"]
