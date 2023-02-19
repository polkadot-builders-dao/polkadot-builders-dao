import { PageHead } from "../../components/PageHead"
import { Proposals } from "./Proposals"

export const Governance = () => {
  return (
    <div>
      <PageHead title="Governance" subtitle="Here is where we make things happen" />
      <Proposals />
    </div>
  )
}
