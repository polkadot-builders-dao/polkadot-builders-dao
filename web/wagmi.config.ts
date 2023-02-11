import "dotenv/config"
import { defineConfig, loadEnv } from "@wagmi/cli"
import { react, hardhat } from "@wagmi/cli/plugins"

import fs from "fs"
import path from "path"

export default defineConfig(async () => {
  // const chainId = process.env.VITE_CHAIN_ID ?? "31337"

  // const platforms = JSON.parse(fs.readFileSync("./contracts/platforms.json", "utf8"))
  // const platform = platforms[chainId]

  // const contracts: any = Object.entries<{ address: string; abi: string }>(platform)
  //   .map(([name, { address, abi }]) => ({ name, chainId, address, abi }))
  //   .filter(({ name }) => name !== "PBTokenDna" && name !== "PBTokenComposer")

  return {
    out: "src/contracts/generated.ts",
    plugins: [
      hardhat({
        project: "../contracts",
        commands: {
          clean: "yarn hardhat clean",
          build: "yarn hardhat compile",
          rebuild: "yarn hardhat compile",
        },
        // include: [
        //   // the following patterns are included by default
        //   "PBTokenPartsStore.json",
        //   "PBToken.json",
        //   "PBAuctionHouse.json",
        // ],
        // exclude: ["PBTokenComposer.json"],
      }),
      react(),
    ],
  }
})
