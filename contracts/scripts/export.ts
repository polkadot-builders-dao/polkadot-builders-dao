import { ethers, deployments, getNamedAccounts } from "hardhat"
import fs from "fs-extra"
import path from "path"

const exportDir = path.resolve("./artifacts/export")
const deploymentsDir = path.resolve("./deployments")

// TODO delete script in favor of hardhat-deploy ?
async function main() {
  await new Promise((resolve) => setTimeout(resolve, 5_000))
  console.log("Exporting contracts...")
  if (await fs.pathExists(exportDir)) await fs.rmdir(exportDir)

  const platforms: Record<string, any> = {}

  for (const platform of await fs.readdir(deploymentsDir, { withFileTypes: true }))
    if (platform.isDirectory()) {
      const platformDir = path.join(deploymentsDir, platform.name)

      const chainId = await fs.readFile(path.join(platformDir, ".chainId"), "utf8")

      const platformExport: Record<string, any> = {}
      for (const deployment of await fs.readdir(platformDir, { withFileTypes: true }))
        if (deployment.isFile() && deployment.name.endsWith(".json")) {
          console.log("processing ", deployment.name)
          const { address, abi } = await fs.readJSON(path.join(platformDir, deployment.name))
          platformExport[deployment.name.replace(".json", "")] = { address, abi }
        }
      platforms[chainId] = platformExport
    }

  await fs.ensureDir(exportDir)
  await fs.writeJSON(path.join(exportDir, "platforms.json"), platforms, {
    encoding: "utf8",
    spaces: 2,
  })

  console.log("Successfully exported contracts")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
