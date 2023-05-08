import classNames from "classnames"
import { FC, PropsWithChildren } from "react"
import { EthValue } from "../../components/EthValue"
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
import { EthAddress } from "../../components/EthAddress"

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
  const auctionHouse = useAuctionHouse({
    chainId: CHAIN_ID,
  })
  const { data: owner } = useAuctionHouseOwner({ chainId: CHAIN_ID })
  const { data: config } = useAuctionHouseGetConfig({
    chainId: CHAIN_ID,
  })

  if (!config) return null

  return (
    <Section title="Auction House">
      <SectionRow title="Address" className="font-mono font-bold">
        <EthAddress address={auctionHouse?.address} withHref />
      </SectionRow>
      <SectionRow title="Owner" className="font-mono font-bold">
        <EthAddress address={owner} withHref />
      </SectionRow>
      <SectionRow title="Treasury" className="font-mono font-bold">
        <EthAddress address={config.treasury} withHref />
      </SectionRow>
      <SectionRow title="Token" className="font-mono font-bold">
        <EthAddress address={config.token} withHref />
      </SectionRow>
      <SectionRow title="Duration">{config.duration.toNumber()} seconds</SectionRow>
      <SectionRow title="Extended Duration">
        {config.extendedDuration.toNumber()} seconds
      </SectionRow>
      <SectionRow title="Min First Bid">
        <EthValue wei={config.minFirstBid} />
      </SectionRow>
      <SectionRow title="Min Bid Increment">
        {config.minBidIncrementPercent.toNumber()} %
      </SectionRow>
    </Section>
  )
}

const GovernanceConfig = () => {
  const governor = useDaoGovernor({ chainId: CHAIN_ID })

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
  const { data: token } = useDaoGovernorToken({ chainId: CHAIN_ID })
  const { data: votinDelay } = useDaoGovernorVotingDelay({ chainId: CHAIN_ID })
  const { data: votinPeriod } = useDaoGovernorVotingPeriod({ chainId: CHAIN_ID })

  return (
    <Section title="Governance">
      <SectionRow title="Address" className="font-mono font-bold">
        <EthAddress address={governor?.address} withHref />
      </SectionRow>
      <SectionRow title="Counting Mode">{countingMode}</SectionRow>
      <SectionRow title="Ballot Type Hash" className="font-mono font-bold">
        {ballotTypeHash}
      </SectionRow>
      <SectionRow title="Token" className="font-mono font-bold">
        <EthAddress address={token} withHref />
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
  const crest = useCrest({ chainId: CHAIN_ID })
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
  const { data: totalSupply } = useCrestTotalSupply({ chainId: CHAIN_ID })

  return (
    <Section title="Crest">
      <SectionRow title="Address" className="font-mono font-bold">
        <EthAddress address={crest?.address} withHref />
      </SectionRow>
      <SectionRow title="Owner" className="font-mono font-bold">
        <EthAddress address={owner} withHref />
      </SectionRow>
      <SectionRow title="Auction House" className="font-mono font-bold">
        <EthAddress address={auctionHouse} withHref />
      </SectionRow>
      <SectionRow title="Founders" className="font-mono font-bold">
        <EthAddress address={founders} withHref />
      </SectionRow>
      <SectionRow title="Parts Store" className="font-mono font-bold">
        <EthAddress address={partsStore} withHref />
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
    <Section title="Parts Store">
      <SectionRow title="Address" className="font-mono font-bold">
        <EthAddress address={partsStore?.address} withHref />
      </SectionRow>
      <SectionRow title="Owner" className="font-mono font-bold">
        <EthAddress address={owner} withHref />
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
