import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ContractTransaction } from "ethers"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const crestDeployment = await deployments.get("Crest")
  const crest = await ethers.getContractAt("Crest", crestDeployment.address)

  const founderMints = [
    { address: "0x689a81e645f7567D2a1fb0b01822CE21D42b1e64", dna: "320417288806211999718637572" },
    { address: "0x55361272A635443387BbdE798cfBEA591933Bc46", dna: "1242846726141689384048526592" },
  ]
  for (const founderMint of founderMints) {
    try {
      if ((await crest.balanceOf(founderMint.address)).toNumber() > 0) continue
      console.log("Minting a crest for founder", founderMint.address)
      const mint = await crest.mintSpecific(
        founderMint.address,
        ethers.BigNumber.from(founderMint.dna)
      )
      await mint.wait(3)
    } catch (err) {
      console.log("Failed to mint :(", err)
    }
  }

  const deployed = await deploy("AuctionHouse", {
    from: deployer,
    args: [crest.address, deployer],
    log: true,
  })

  console.log("setting test values for auction house")
  const auctionHouse = await ethers.getContractAt("AuctionHouse", deployed.address)

  // set practical defaults for dev & test, real value will be defined by governance before launch
  await (await auctionHouse.setDuration(180)).wait()
  await (await auctionHouse.setExtendedDuration(60)).wait()
  await (await auctionHouse.setMinFirstBid(ethers.utils.parseEther("0.1"))).wait()

  console.log("associating auction house with crest")
  await (await crest.setAuctionHouse(deployed.address)).wait()
}
export default func
func.tags = ["AuctionHouse"]
func.dependencies = ["ProvisionParts"]
