import "dotenv/config"
import { defineConfig } from "@wagmi/cli"
import { react, hardhat } from "@wagmi/cli/plugins"
import fs from "fs"
import path from "path"

const CONTRACTS = [
  "PBToken",
  "PBTokenPartsStore",
  "PBAuctionHouse",
  "PBTokenDna",
  "PBTokenComposer",
] as const

const getContractsDeployments = () => {
  const deployments = CONTRACTS.reduce(
    (acc, contractName) => ({ ...acc, [contractName]: {} as Record<number, string> }),
    {}
  )

  for (const dirName of fs.readdirSync("../contracts/deployments")) {
    const dirPath = path.join("../contracts/deployments", dirName)
    if (!fs.lstatSync(dirPath).isDirectory()) return
    const chainId = Number(fs.readFileSync(path.join(dirPath, ".chainId"), "utf8"))
    for (const contract of CONTRACTS) {
      const address = JSON.parse(
        fs.readFileSync(path.join(dirPath, `${contract}.json`), "utf8")
      ).address
      deployments[contract][chainId] = address
    }
  }

  console.log("deployments", deployments)

  return deployments
}

export default defineConfig(async () => {
  const deployments = getContractsDeployments()

  fs.writeFileSync("src/contracts/deployments.json", JSON.stringify(deployments, null, 2))

  return {
    out: "src/contracts/generated.ts",
    plugins: [
      hardhat({
        project: "../contracts",
        deployments,
        commands: {
          clean: "yarn hardhat clean",
          build: "yarn hardhat compile",
          rebuild: "yarn hardhat compile",
        },
      }),
      react(),
    ],
  }
})
