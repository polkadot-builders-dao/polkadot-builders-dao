import { useNetwork, useProvider } from "wagmi"
import { Layout } from "../components/Layout"
import { usePbTokenAuctionHouse } from "../contracts/generated"
import { Auction } from "../features/Auction/Auction"

import { Playground } from "../features/Playground/Playground"
import { CHAIN_ID } from "../lib/settings"
import { token } from "../typechain-types/@openzeppelin/contracts"

function HomePage() {
  return (
    <Layout>
      <Auction />
    </Layout>
  )
}

export default HomePage
