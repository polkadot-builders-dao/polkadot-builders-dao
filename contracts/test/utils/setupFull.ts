import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { deployments, getNamedAccounts } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { AuctionHouse, Crest, TokenGenerator, DnaManager, PartsStore } from "../../typechain-types"

type SetupOptions = {
  //provisionParts: boolean
}

type SetupOutput = {
  tokenPartsContract: PartsStore
  tokenDna: DnaManager
  composer: TokenGenerator
  token: Crest
  auctionHouse: AuctionHouse
  users: {
    deployer: string
    dao: string
    founders: string
    user1: string
    user2: string
  }
  signers: {
    deployer: SignerWithAddress
    dao: SignerWithAddress
    founders: SignerWithAddress
    user1: SignerWithAddress
    user2: SignerWithAddress
  }
  hre: HardhatRuntimeEnvironment
}

export const setupFull = deployments.createFixture<SetupOutput, SetupOptions>(
  async (hre, options) => {
    const { ethers } = hre
    console.time("get fixture AuctionHouse_Deploy_TEST")
    const { AuctionHouse, PartsStore, DnaManager, TokenGenerator, Crest } =
      await deployments.fixture("AuctionHouse_Deploy_TEST")
    console.timeEnd("get fixture AuctionHouse_Deploy_TEST")

    const { deployer, dao, founders, user1, user2 } = await getNamedAccounts()
    const users = { deployer, dao, founders, user1, user2 }
    const signers = {
      deployer: await ethers.getSigner(deployer),
      dao: await ethers.getSigner(dao),
      founders: await ethers.getSigner(founders),
      user1: await ethers.getSigner(user1),
      user2: await ethers.getSigner(user2),
    }
    const contracts = {
      tokenPartsContract: (await ethers.getContractFactory("PartsStore")).attach(
        PartsStore.address
      ) as PartsStore,
      tokenDna: (await ethers.getContractFactory("DnaManager")).attach(
        DnaManager.address
      ) as DnaManager,
      composer: (
        await ethers.getContractFactory("TokenGenerator", {
          libraries: {
            DnaManager: DnaManager.address,
          },
        })
      ).attach(TokenGenerator.address) as TokenGenerator,
      auctionHouse: (await ethers.getContractFactory("AuctionHouse")).attach(
        AuctionHouse.address
      ) as AuctionHouse,
      token: (
        await ethers.getContractFactory("Crest", {
          libraries: {
            DnaManager: DnaManager.address,
            TokenGenerator: TokenGenerator.address,
          },
        })
      ).attach(Crest.address) as Crest,
    }

    return {
      ...contracts,
      users,
      signers,
      hre,
    }
  }
)
