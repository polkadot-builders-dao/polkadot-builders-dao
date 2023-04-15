import { FC, PropsWithChildren, ReactNode, useMemo } from "react"
import { NavLink, To } from "react-router-dom"
import classNames from "classnames"
import { DaoLogoColor } from "../assets/logos"
import { useAuctionHouseGetConfig } from "../contracts/generated"
import { useBalance } from "wagmi"
import { CHAIN_ID } from "../lib/settings"
import { useBlockExplorerUrl } from "../lib/useBlockExplorerUrl"
import { IconBrandDiscord, IconHeartFilled } from "@tabler/icons-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

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
  const { data: config } = useAuctionHouseGetConfig({
    chainId: CHAIN_ID,
  })
  const { data: balance } = useBalance({
    address: config?.treasury,
    chainId: CHAIN_ID,
  })

  const url = useMemo(() => {
    if (!blockExplorerUrl) return "https://perdu.com"
    return `${blockExplorerUrl}/address/${config?.treasury}`
  }, [blockExplorerUrl, config?.treasury])

  if (!config || !balance) return null

  return (
    <a
      title={`${balance.formatted} ${balance.symbol}`}
      href={url}
      //className="flex items-center gap-2 rounded border border-white/20 bg-neutral-950/30 px-2 py-2 text-xs text-neutral-200 hover:bg-neutral-950/10"
      className="btn secondary flex items-center gap-2 text-xs"
    >
      <div className="hidden sm:block">Treasury</div>
      <div>
        {Number(balance.formatted).toFixed()} {balance.symbol}
      </div>
    </a>
  )
}

export const Layout: FC<PropsWithChildren & { content?: ReactNode }> = ({ children, content }) => {
  return (
    <div id="layout" className="flex min-h-screen flex-col">
      <header className="w-full py-5 text-center">
        <div className="inline-flex h-10 w-full max-w-5xl items-center justify-between gap-4 px-3 sm:px-6">
          <div className="flex items-center gap-4">
            <DaoLogoColor className="text-5xl" />
            <Treasury />
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://discord.gg/dCm9utHjYz"
              className="btn secondary flex flex-col justify-center"
            >
              <IconBrandDiscord className="inline-block" />
            </a>
            <div className="btn-connect-wrapper">
              <ConnectButton accountStatus="avatar" label="Connect" />
            </div>
          </div>
        </div>
        <nav>
          <ul className="mx-auto flex w-full max-w-5xl gap-4 px-6">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/crests">Crests</Link>
            </li>
            <li>
              <Link to="/playground">Playground</Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className="flex w-full grow flex-col">
        <section className="animate-fade-in container mx-auto my-4 w-full max-w-5xl  px-3 sm:px-6">
          {children}
        </section>
        <section className="grow bg-neutral-950 pb-4">{content}</section>
      </div>
      <footer className="flex flex-col items-center justify-center border-t border-neutral-800 bg-neutral-900 py-4 text-sm shadow">
        <div className="text-center">
          Built with <IconHeartFilled className="inline h-5 w-5 text-red-500" /> for the Polkadot
          ecosystem
        </div>
        <div className="text-center">
          Supercharged with{" "}
          <a href="https://subsquid.io" className="text-neutral-300 hover:text-neutral-200">
            subsquid.io
          </a>
        </div>
      </footer>
    </div>
  )
}
