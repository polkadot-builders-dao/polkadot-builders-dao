import { Layout } from "../components/Layout"
import { PlaygroundProvider } from "../features/Playground/context"
import { DnaEditor } from "../features/Playground/DnaEditor"

import { Playground } from "../features/Playground/Playground"

export const PlaygroundPage = () => (
  <PlaygroundProvider>
    <Layout>
      <Playground />
    </Layout>
    <div className="animate-fade-in container mx-auto my-4 w-full max-w-5xl px-3 py-8 sm:px-6">
      <DnaEditor />
    </div>
  </PlaygroundProvider>
)
