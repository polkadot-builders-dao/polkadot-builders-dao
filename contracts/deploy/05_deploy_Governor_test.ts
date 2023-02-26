import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

// TODO add another deployment to transfer ownership of all contracts to the governor
// most of the code for that is here as comments

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.time("DEPLOYMENT AuctionHouse_PROD")
  const { deployments, getNamedAccounts, ethers } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  // const partsStoreDeploymnet = await deployments.get("PartsStore")
  // const partsStore = await ethers.getContractAt("PartsStore", partsStoreDeploymnet.address)

  const crestDeployment = await deployments.get("Crest")
  // const crest = await ethers.getContractAt("Crest", crestDeployment.address)

  // const auctionHouseDeployment = await deployments.get("AuctionHouse")
  // const auctionHouse = await ethers.getContractAt("AuctionHouse", auctionHouseDeployment.address)

  //const governorDeployment =
  await deploy("DaoGovernor", {
    from: deployer,
    args: [crestDeployment.address],
    log: true,
  })
  //  const governor = await ethers.getContractAt("DaoGovernor", governorDeployment.address)

  // transfer ownership of all contracts to the governor
  // const batch2 = await Promise.all([
  //   auctionHouse.transferOwnership(governor.address),
  //   partsStore.transferOwnership(governor.address),
  //   crest.transferOwnership(governor.address),
  // ])
  // await Promise.all(batch2.map((tx) => tx.wait()))
  console.timeEnd("DEPLOYMENT AuctionHouse_PROD")
}
export default func
func.tags = ["DaoGovernor_Deploy_TEST"]
func.dependencies = ["AuctionHouse_Deploy_TEST"]
