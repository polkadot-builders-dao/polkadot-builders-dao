import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { FOUNDERS_MINTS } from "../util/contants"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, ethers } = hre

  const crestDeployment = await deployments.get("Crest")
  const crest = await ethers.getContractAt("Crest", crestDeployment.address)

  for (const founderMint of FOUNDERS_MINTS) {
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
}
export default func
func.tags = ["FounderMints_PROD"]
func.dependencies = ["Crest_Deploy", "PartsStore_Provision"]
