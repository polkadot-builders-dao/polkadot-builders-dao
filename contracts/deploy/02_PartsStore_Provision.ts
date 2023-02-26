import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { defineParts } from "../util/defineParts"
import { PartsStore } from "../typechain-types"

const func: DeployFunction = async function ({ deployments, ethers }: HardhatRuntimeEnvironment) {
  const PartsStore = await deployments.get("PartsStore")

  const store = <PartsStore>await ethers.getContractAt("PartsStore", PartsStore.address)

  await defineParts(store)
}
export default func
func.tags = ["PartsStore_Provision"]
func.dependencies = ["PartsStore_Deploy"]
