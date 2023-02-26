import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { deployments, getNamedAccounts } from "hardhat"
import { AuctionHouse, Crest, TokenGenerator, DnaManager, PartsStore } from "../../typechain-types"

type SetupOptions = {
  provisionParts: boolean
}

type SetupOutput = {
  tokenPartsContract: PartsStore
  tokenDna: DnaManager
  composer: TokenGenerator
  token: Crest
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
  const { PartsStore, DnaManager, TokenGenerator, Crest } = options?.provisionParts
    ? await deployments.fixture("PartsStore_Provision")
    : await deployments.fixture("Crest_Deploy")

  //const { AuctionHouse } = await deployments.fixture("AuctionHouse")

  const { deployer, dao, founders } = await getNamedAccounts()
  const users = { deployer, dao, founders }
  const signers = {
    deployer: await ethers.getSigner(deployer),
    dao: await ethers.getSigner(dao),
    founders: await ethers.getSigner(founders),
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
    // auctionHouse: (await ethers.getContractFactory("AuctionHouse")).attach(
    //   AuctionHouse.address
    // ) as AuctionHouse,
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
  }
})
