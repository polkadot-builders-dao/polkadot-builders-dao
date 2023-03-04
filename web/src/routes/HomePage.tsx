import { Layout } from "../components/Layout"
import { Auction } from "../features/Auction/Auction"
import { HomePageContent } from "../features/HomePageContent/HomePageContent"

export const HomePage = () => (
  <>
    {/* layout will use current crest's bg color */}
    <Layout>
      <Auction />
    </Layout>
    <section className="animate-fade-in container mx-auto my-4 w-full max-w-5xl px-6 pb-10">
      <HomePageContent />
    </section>
  </>
)
