import classNames from "classnames"
import { ethers } from "ethers"
import { FC, PropsWithChildren } from "react"
import { Chain } from "wagmi"
import { PageHead } from "../../components/PageHead"
import {
  useAuctionHouse,
  useAuctionHouseGetConfig,
  useAuctionHouseOwner,
  useCrest,
  useCrestAuctionHouse,
  useCrestFounders,
  useCrestOwner,
  useCrestStore,
  useCrestTotalSupply,
  useDaoGovernor,
  useDaoGovernorBallotTypehash,
  useDaoGovernorCountingMode,
  useDaoGovernorQuorumDenominator,
  useDaoGovernorQuorumNumerator,
  useDaoGovernorToken,
  useDaoGovernorVotingDelay,
  useDaoGovernorVotingPeriod,
  usePartsStore,
  usePartsStoreOwner,
} from "../../contracts/generated"
import { CHAIN_ID } from "../../lib/settings"
import { supportedChains } from "../../lib/wagmi/supportedChains"

const network = supportedChains.find((c) => c.id === CHAIN_ID) as Chain

const SectionRow = ({
  title,
  className,
  children,
}: { title: string; className?: string } & PropsWithChildren) => {
  return (
    <>
      <div>{title}</div>
      <div
        className={classNames(
          "col-span-2 overflow-hidden text-ellipsis whitespace-nowrap",
          className
        )}
      >
        {children}
      </div>
    </>
  )
}

const Section: FC<{ title: string } & PropsWithChildren> = ({ title, children }) => {
  return (
    <div className="mt-8 w-full overflow-hidden">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="grid grid-cols-3 gap-x-4">{children}</div>
    </div>
  )
}

const AuctionHouseConfig = () => {
  const auctionHouse = useAuctionHouse()
  const { data: owner } = useAuctionHouseOwner()
  const { data: config } = useAuctionHouseGetConfig({
    chainId: CHAIN_ID,
  })

  if (!config) return null

  return (
    <Section title="Auction House">
      <SectionRow title="Address" className="font-mono font-bold">
        {auctionHouse?.address}
      </SectionRow>
      <SectionRow title="Owner" className="font-mono font-bold">
        {owner}
      </SectionRow>
      <SectionRow title="Treasury" className="font-mono font-bold">
        {config.treasury}
      </SectionRow>
      <SectionRow title="Token" className="font-mono font-bold">
        {config.token}
      </SectionRow>
      <SectionRow title="Duration">{config.duration.toNumber()} seconds</SectionRow>
      <SectionRow title="Extended Duration">
        {config.extendedDuration.toNumber()} seconds
      </SectionRow>
      <SectionRow title="Min First Bid">
        {ethers.utils.formatEther(config.minFirstBid)} {network.nativeCurrency.symbol}
      </SectionRow>
      <SectionRow title="Min Big Increment">
        {config.minBidIncrementPercent.toNumber()} %
      </SectionRow>
    </Section>
  )
}

const GovernanceConfig = () => {
  const governor = useDaoGovernor()

  const { data: countingMode } = useDaoGovernorCountingMode({
    chainId: CHAIN_ID,
  })
  const { data: ballotTypeHash } = useDaoGovernorBallotTypehash({
    chainId: CHAIN_ID,
  })
  const { data: quorumNum } = useDaoGovernorQuorumNumerator({
    chainId: CHAIN_ID,
  })
  const { data: quorumDen } = useDaoGovernorQuorumDenominator({
    chainId: CHAIN_ID,
  })
  const { data: token } = useDaoGovernorToken()
  const { data: votinDelay } = useDaoGovernorVotingDelay()
  const { data: votinPeriod } = useDaoGovernorVotingPeriod()

  return (
    <Section title="Governance">
      <SectionRow title="Address" className="font-mono font-bold">
        {governor?.address}
      </SectionRow>
      <SectionRow title="Counting Mode">{countingMode}</SectionRow>
      <SectionRow title="Ballot Type Hash" className="font-mono font-bold">
        {ballotTypeHash}
      </SectionRow>
      <SectionRow title="Token" className="font-mono font-bold">
        {token}
      </SectionRow>
      <SectionRow title="Quorum">
        {quorumNum?.toString()} / {quorumDen?.toString()}
      </SectionRow>
      <SectionRow title="Voting Delay">{votinDelay?.toString()} blocks</SectionRow>
      <SectionRow title="Voting Period">{votinPeriod?.toString()} blocks</SectionRow>
    </Section>
  )
}

const CrestConfig = () => {
  const crest = useCrest()
  const { data: auctionHouse } = useCrestAuctionHouse({
    chainId: CHAIN_ID,
  })
  const { data: founders } = useCrestFounders({
    chainId: CHAIN_ID,
  })
  const { data: partsStore } = useCrestStore({
    chainId: CHAIN_ID,
  })
  const { data: owner } = useCrestOwner({
    chainId: CHAIN_ID,
  })
  const { data: totalSupply } = useCrestTotalSupply()

  return (
    <Section title="Crest">
      <SectionRow title="Address" className="font-mono font-bold">
        {crest?.address}
      </SectionRow>
      <SectionRow title="Owner" className="font-mono font-bold">
        {owner}
      </SectionRow>
      <SectionRow title="Auction House" className="font-mono font-bold">
        {auctionHouse}
      </SectionRow>
      <SectionRow title="Founders" className="font-mono font-bold">
        {founders}
      </SectionRow>
      <SectionRow title="Parts Store" className="font-mono font-bold">
        {partsStore}
      </SectionRow>
      <SectionRow title="Total Supply">{totalSupply?.toNumber()}</SectionRow>
    </Section>
  )
}

const PartsStoreConfig = () => {
  const partsStore = usePartsStore()
  const { data: owner } = usePartsStoreOwner({
    chainId: CHAIN_ID,
  })

  return (
    <Section title="PartsStore">
      <SectionRow title="Address" className="font-mono font-bold">
        {partsStore?.address}
      </SectionRow>
      <SectionRow title="Owner" className="font-mono font-bold">
        {owner}
      </SectionRow>
    </Section>
  )
}

export const Contracts = () => {
  return (
    <div>
      <PageHead title="Contracts" subtitle="Review contracts settings" />
      <GovernanceConfig />
      <AuctionHouseConfig />
      <CrestConfig />
      <PartsStoreConfig />
    </div>
  )
}
