import "dotenv/config"
import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
// import "@nomiclabs/hardhat-ethers"
import "hardhat-deploy"

const config: HardhatUserConfig = {
  solidity: {
    // TODO make this work
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1_000,
      },
    },
  },
  namedAccounts: {
    deployer: 0,
    founders: 1,
    dao: 2,
    user1: 3,
    user2: 4,
  },
  networks: {
    hardhat: {
      saveDeployments: true,
      mining: {
        auto: true,
        interval: 3000,
      },
    },
    localhost: {
      saveDeployments: true,
      mining: {
        auto: true,
        interval: 3000,
      },
    },
    moonbase: {
      chainId: 1287,
      saveDeployments: true,
      url: "https://rpc.api.moonbase.moonbeam.network",
      accounts: [process.env.DEPLOYER_MOONBASE],
      verify: {
        etherscan: {
          apiKey: process.env.MOONSCAN_API_KEY,
          apiUrl: "https://api-moonbase.moonscan.io",
        },
      },
    },
    moonbeam: {
      chainId: 1284,
      saveDeployments: true,
      url: "https://rpc.api.moonbeam.network",
      accounts: [process.env.DEPLOYER_MOONBEAM],
      verify: {
        etherscan: {
          apiKey: process.env.MOONSCAN_API_KEY,
          apiUrl: "https://api-moonbeam.moonscan.io",
        },
      },
    },
  },
  // etherscan: {
  //   apiKey: {
  //     moonbeam: process.env.MOONSCAN_API_KEY,
  //   },
  // },
  // gasReporter: {
  //   enabled: true,
  //   gasPrice: 21,
  // },
}

export default config
