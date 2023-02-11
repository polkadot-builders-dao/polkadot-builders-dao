import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { defineParts } from "../util/defineParts"
import { PBTokenPartsStore } from "../typechain-types"

const func: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
  ethers,
}: HardhatRuntimeEnvironment) {
  const { deploy, get } = deployments

  //const { deployer, tokenOwner, storeOwner } = await getNamedAccounts()

  // const storeFactory = ethers.getContractFactory("PBTokenPartsStore")
  const store = <PBTokenPartsStore>(
    await ethers.getContractAt("PBTokenPartsStore", (await get("PBTokenPartsStore")).address)
  )

  await defineParts(store)
}
export default func
func.tags = ["ProvisionParts"]
func.dependencies = ["PBToken"]
