import { FC, PropsWithChildren } from "react"
import { ConnectButton } from "./ConnectButton"
import imgHorizontalLogoColor from "../assets/logos/pb-dao-horizontal-color.png"

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <header className="fixed top-0 left-0 w-full py-5 text-center">
        <div className="inline-flex h-10 w-full max-w-5xl gap-4 px-6 ">
          <div className="grow">
            <img src={imgHorizontalLogoColor} alt="logo" className="h-10 w-auto" />
          </div>
          <div className="flex gap-4">
            <ConnectButton className="w-48" />
          </div>
        </div>
      </header>
      <div className="h-16"></div>
      <section className="animate-fade-in container mx-auto w-full max-w-5xl py-10 px-6">
        {children}
      </section>
    </div>
  )
}
