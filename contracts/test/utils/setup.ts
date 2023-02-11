import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { deployments, getNamedAccounts } from "hardhat"
import {
  PBAuctionHouse,
  PBToken,
  PBTokenComposer,
  PBTokenDna,
  PBTokenPartsStore,
} from "../../typechain-types"

type SetupOptions = {
  provisionParts: boolean
}

type SetupOutput = {
  tokenPartsContract: PBTokenPartsStore
  tokenDna: PBTokenDna
  composer: PBTokenComposer
  token: PBToken
  users: {
    deployer: string
    dao: string
    founders: string
  }
  signers: {
    deployer: SignerWithAddress
    dao: SignerWithAddress
    founders: SignerWithAddress
  }
}

export const setup = deployments.createFixture<SetupOutput, SetupOptions>(async (hre, options) => {
  const { ethers } = hre
  const { PBTokenPartsStore, PBTokenDna, PBTokenComposer, PBToken } = options?.provisionParts
    ? await deployments.fixture("ProvisionParts")
    : await deployments.fixture("PBToken")

  //const { PBAuctionHouse } = await deployments.fixture("PBAuctionHouse")

  const { deployer, dao, founders } = await getNamedAccounts()
  const users = { deployer, dao, founders }
  const signers = {
    deployer: await ethers.getSigner(deployer),
    dao: await ethers.getSigner(dao),
    founders: await ethers.getSigner(founders),
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
    // auctionHouse: (await ethers.getContractFactory("PBAuctionHouse")).attach(
    //   PBAuctionHouse.address
    // ) as PBAuctionHouse,
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
  }
})
