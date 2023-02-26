import { FC, PropsWithChildren, ReactNode, useMemo } from "react"
import { ConnectButton } from "./ConnectButton"
import { NavLink, To } from "react-router-dom"
import classNames from "classnames"
import { DaoLogoColor } from "../assets/logos"
import { useWallet } from "../lib/useWallet"
import { useAuctionHouseGetConfig } from "../contracts/generated"
import { useBalance } from "wagmi"
import { supportedChains } from "../lib/wagmi/supportedChains"
import { CHAIN_ID } from "../lib/settings"
import { useBlockExplorerUrl } from "../lib/useBlockExplorerUrl"

const Link = ({ to, children }: { to: To; children: ReactNode }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        classNames(
          "text-neutral-300 hover:text-neutral-100",
          isActive ? "font-bold" : "font-normal"
        )
      }
    >
      {children}
    </NavLink>
  )
}

const Treasury = () => {
  const blockExplorerUrl = useBlockExplorerUrl(CHAIN_ID)
  const { data: config } = useAuctionHouseGetConfig()
  const { data: balance } = useBalance({
    address: config?.treasury,
  })

  console.log("balance", { balance })

  const url = useMemo(() => {
    if (!blockExplorerUrl) return "https://perdu.com"
    return `${blockExplorerUrl}/address/${config?.treasury}}`
  }, [blockExplorerUrl, config?.treasury])

  if (!config || !balance) return null

  return (
    <a
      title={`${balance.formatted} ${balance.symbol}`}
      href={url}
      className="flex items-center gap-2 rounded border border-neutral-600 bg-neutral-900 px-2 py-2 text-xs hover:bg-neutral-800"
    >
      <div>Treasury</div>
      <div>
        {Number(balance.formatted).toFixed()} {balance.symbol}
      </div>
    </a>
  )
}

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { address } = useWallet()
  return (
    <div>
      <header className="w-full py-5 text-center">
        <div className="inline-flex h-10 w-full max-w-5xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <DaoLogoColor className="text-5xl" />
            <Treasury />
          </div>

          <ConnectButton className="w-48" />
        </div>
        <nav>
          <ul className="mx-auto flex w-full max-w-5xl gap-4 px-6">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/playground">Playground</Link>
            </li>
            {address && (
              <li>
                <Link to="/my-crests">My Crests</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <section className="animate-fade-in container mx-auto my-4 w-full max-w-5xl px-6">
        {children}
      </section>
    </div>
  )
}
