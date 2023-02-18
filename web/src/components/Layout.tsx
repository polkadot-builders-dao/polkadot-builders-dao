import { FC, PropsWithChildren, ReactNode } from "react"
import { ConnectButton } from "./ConnectButton"
import { NavLink, To } from "react-router-dom"
import classNames from "classnames"
import { DaoLogoColor } from "../assets/logos"
import { useWallet } from "../lib/useWallet"

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

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { address } = useWallet()
  return (
    <div>
      <header className="w-full py-5 text-center">
        <div className="inline-flex h-10 w-full max-w-5xl items-center justify-between gap-4 px-6">
          <DaoLogoColor className="text-5xl" />
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
