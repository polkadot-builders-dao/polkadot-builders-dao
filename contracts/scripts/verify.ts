import hre, { deployments } from "hardhat"

const DEPLOYMENTS = [
  "PartsStore",
  "DnaManager",
  "TokenGenerator",
  "Crest",
  "AuctionHouse",
  "DaoGovernor",
]

// some contracts can't be verified with hardhat-deploy because of libraries not beeing detected
async function main() {
  for (const key of DEPLOYMENTS) {
    try {
      const dep = await deployments.getOrNull(key)
      if (!dep) {
        console.log("Could not find deployment %s, skipping...", key)
        continue
      }
      await hre.run("verify:verify", {
        address: dep.address,
        constructorArguments: dep.args,
        //  libraries: dep.libraries,
      })
    } catch (err) {
      console.log("Failed to verify %s", key, err)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
