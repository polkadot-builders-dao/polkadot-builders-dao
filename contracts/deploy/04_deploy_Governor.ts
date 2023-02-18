import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const partsStoreDeploymnet = await deployments.get("PartsStore")
  const partsStore = await ethers.getContractAt("PartsStore", partsStoreDeploymnet.address)

  const crestDeployment = await deployments.get("Crest")
  const crest = await ethers.getContractAt("Crest", crestDeployment.address)

  const auctionHouseDeployment = await deployments.get("AuctionHouse")
  const auctionHouse = await ethers.getContractAt("AuctionHouse", auctionHouseDeployment.address)

  const governorDeployment = await deploy("DaoGovernor", {
    from: deployer,
    args: [crestDeployment.address],
    log: true,
  })
  const governor = await ethers.getContractAt("DaoGovernor", governorDeployment.address)

  // set practical defaults for dev & test, real value will be defined by governance before launch
  const batch1 = await Promise.all([
    auctionHouse.setDuration(180),
    auctionHouse.setExtendedDuration(60),
    auctionHouse.setMinFirstBid(ethers.utils.parseEther("0.1")),
    auctionHouse.setTreasury(governor.address),
  ])
  await Promise.all(batch1.map((tx) => tx.wait()))

  // transfer ownership of all contracts to the governor
  const batch2 = await Promise.all([
    auctionHouse.transferOwnership(governor.address),
    partsStore.transferOwnership(governor.address),
    crest.transferOwnership(governor.address),
  ])
  await Promise.all(batch2.map((tx) => tx.wait()))
}
export default func
func.tags = ["DaoGovernor"]
func.dependencies = ["AuctionHouse"]
