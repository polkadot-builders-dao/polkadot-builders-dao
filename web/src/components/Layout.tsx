import { FC, PropsWithChildren, ReactNode } from "react"
import { ConnectButton } from "./ConnectButton"
import imgHorizontalLogoColor from "../assets/logos/pb-dao-horizontal-color.png"
import { NavLink, To } from "react-router-dom"
import classNames from "classnames"

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
  return (
    <div>
      <header className="fixed top-0 left-0 w-full py-5 text-center">
        <div className="inline-flex h-10 w-full max-w-5xl items-center justify-between gap-4 px-6">
          <img src={imgHorizontalLogoColor} alt="logo" className="h-10 w-auto" />
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
          </ul>
        </nav>
      </header>
      <div className="h-20"></div>
      <section className="animate-fade-in container mx-auto w-full max-w-5xl py-10 px-6">
        {children}
      </section>
    </div>
  )
}
