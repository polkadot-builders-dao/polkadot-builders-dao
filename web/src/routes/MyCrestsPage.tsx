import { useAccount } from "wagmi"
import { Layout } from "../components/Layout/Layout"
import { Crests } from "../features/Crests/Crests"

export const MyCrestsPage = () => {
  const { address } = useAccount()
  return (
    <Layout>
      <Crests address={address} />
    </Layout>
  )
}
