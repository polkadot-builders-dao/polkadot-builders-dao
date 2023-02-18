import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { defineParts } from "../util/defineParts"
import { PartsStore } from "../typechain-types"

const func: DeployFunction = async function ({ deployments, ethers }: HardhatRuntimeEnvironment) {
  const { get } = deployments

  const store = <PartsStore>(
    await ethers.getContractAt("PartsStore", (await get("PartsStore")).address)
  )

  await defineParts(store)
}
export default func
func.tags = ["ProvisionParts"]
func.dependencies = ["Crest"]
