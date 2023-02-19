import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const crestDeployment = await deployments.get("Crest")
  const crest = await ethers.getContractAt("Crest", crestDeployment.address)

  const deployed = await deploy("AuctionHouse", {
    from: deployer,
    args: [crest.address, deployer],
    log: true,
  })

  console.log("Minting founders tokens")
  const mints = await Promise.all([
    crest.mintSpecific(
      "0x689a81e645f7567D2a1fb0b01822CE21D42b1e64",
      ethers.BigNumber.from("320417288806211999718637572")
    ),
    crest.mintSpecific(
      "0x55361272A635443387BbdE798cfBEA591933Bc46",
      ethers.BigNumber.from("1242846726141689384048526592")
    ),
  ])
  await Promise.all(mints.map((m) => m.wait()))

  const auctionHouse = await ethers.getContractAt("AuctionHouse", deployed.address)
  // set practical defaults for dev & test, real value will be defined by governance before launch
  const configs = await Promise.all([
    auctionHouse.setDuration(180),
    auctionHouse.setExtendedDuration(60),
    auctionHouse.setMinFirstBid(ethers.utils.parseEther("0.1")),
    crest.setAuctionHouse(deployed.address),
  ])
  await Promise.all(configs.map((tx) => tx.wait()))
}
export default func
func.tags = ["AuctionHouse"]
func.dependencies = ["ProvisionParts"]
