import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { Crest } from "../typechain-types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const tokenDeployment = await deployments.get("Crest")

  const token = (await ethers.getContractAt("Crest", tokenDeployment.address)) as Crest

  const deployed = await deploy("AuctionHouse", {
    from: deployer,
    args: [token.address, deployer],
    log: true,
  })

  console.log("Minting founders tokens")
  const mints = await Promise.all([
    token.mintSpecific(
      "0x689a81e645f7567D2a1fb0b01822CE21D42b1e64",
      ethers.BigNumber.from("320417288806211999718637572")
    ),
    token.mintSpecific(
      "0x55361272A635443387BbdE798cfBEA591933Bc46",
      ethers.BigNumber.from("1242846726141689384048526592")
    ),
  ])
  await Promise.all(mints.map((m) => m.wait()))

  await token.setAuctionHouse(deployed.address)
}
export default func
func.tags = ["AuctionHouse"]
func.dependencies = ["ProvisionParts"]
