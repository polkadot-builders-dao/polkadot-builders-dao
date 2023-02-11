import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { deployments, getNamedAccounts } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import {
  PBAuctionHouse,
  PBToken,
  PBTokenComposer,
  PBTokenDna,
  PBTokenPartsStore,
} from "../../typechain-types"

type SetupOptions = {
  //provisionParts: boolean
}

type SetupOutput = {
  tokenPartsContract: PBTokenPartsStore
  tokenDna: PBTokenDna
  composer: PBTokenComposer
  token: PBToken
  auctionHouse: PBAuctionHouse
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
    const { PBAuctionHouse, PBTokenPartsStore, PBTokenDna, PBTokenComposer, PBToken } =
      await deployments.fixture("PBAuctionHouse")

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
      tokenPartsContract: (await ethers.getContractFactory("PBTokenPartsStore")).attach(
        PBTokenPartsStore.address
      ) as PBTokenPartsStore,
      tokenDna: (await ethers.getContractFactory("PBTokenDna")).attach(
        PBTokenDna.address
      ) as PBTokenDna,
      composer: (
        await ethers.getContractFactory("PBTokenComposer", {
          libraries: {
            PBTokenDna: PBTokenDna.address,
          },
        })
      ).attach(PBTokenComposer.address) as PBTokenComposer,
      auctionHouse: (await ethers.getContractFactory("PBAuctionHouse")).attach(
        PBAuctionHouse.address
      ) as PBAuctionHouse,
      token: (
        await ethers.getContractFactory("PBToken", {
          libraries: {
            PBTokenDna: PBTokenDna.address,
            PBTokenComposer: PBTokenComposer.address,
          },
        })
      ).attach(PBToken.address) as PBToken,
    }

    return {
      ...contracts,
      users,
      signers,
      hre,
    }
  }
)
