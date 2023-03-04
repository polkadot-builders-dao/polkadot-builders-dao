import { Layout } from "../components/Layout"
import { Auction } from "../features/Auction/Auction"
import { HomePageContent } from "../features/HomePageContent/HomePageContent"

export const HomePage = () => (
  <Layout>
    <Auction />
    <HomePageContent />
  </Layout>
)
