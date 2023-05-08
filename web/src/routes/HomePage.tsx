import { Layout } from "../components/Layout/Layout"
import { Auction } from "../features/Auction/Auction"
import { HomePageContent } from "../features/HomePageContent/HomePageContent"

const Content = () => (
  <div className="animate-fade-in container mx-auto my-4 w-full max-w-5xl px-6 pb-10">
    <HomePageContent />
  </div>
)

export const HomePage = () => (
  <>
    {/* layout will use current crest's bg color */}
    <Layout content={<Content />}>
      <Auction />
    </Layout>
  </>
)
