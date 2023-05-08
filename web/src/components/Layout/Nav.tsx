import {
  IconAdjustments,
  IconBrandDiscord,
  IconBuildingBank,
  IconGavel,
  IconHelp,
  IconLayoutGrid,
  IconSettings,
  IconShoppingCart,
  IconSpeakerphone,
} from "@tabler/icons-react"
import { useNav } from "./NavContext"
import { FC, PropsWithChildren, useMemo, useRef } from "react"
import { URL_DISCORD, URL_DOCUMENTATION, URL_MARKETPLACE, URL_TALLY } from "../../lib/constants"
import { NavLink } from "react-router-dom"
import { useTreasury } from "../../lib/useTreasury"
import { Transition } from "@headlessui/react"
import { usePageColor } from "../../lib/usePageColor"
import { useClickAway } from "react-use"
import classNames from "classnames"

const BTN_CLASS =
  "btn secondary flex items-center gap-2 sm:flex-col sm:w-full sm:h-full relative sm:py-[15%] sm:gap-4"
const ICON_CONTAINER_CLASS = "sm:grow "
const ICON_CLASS = "sm:h-16 sm:w-16"
const CHILDREN_CLASS = ""

const LocalLink: FC<PropsWithChildren & { to: string; icon: FC<{ className?: string }> }> = ({
  to,
  icon: Icon,
  children,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => classNames(BTN_CLASS, isActive && "!bg-polkadot-500")}
    >
      <div className={ICON_CONTAINER_CLASS}>
        <Icon className={ICON_CLASS} />
      </div>
      <div className={CHILDREN_CLASS}>{children}</div>
    </NavLink>
  )
}

const ExternalLink: FC<PropsWithChildren & { href: string; icon: FC<{ className?: string }> }> = ({
  href,
  icon: Icon,
  children,
}) => {
  return (
    <a href={href} target="_blank" className={BTN_CLASS}>
      <div className={ICON_CONTAINER_CLASS}>
        <Icon className={ICON_CLASS} />
      </div>
      <div className={CHILDREN_CLASS}>{children}</div>
    </a>
  )
}

const NavContainer: FC<PropsWithChildren> = ({ children }) => {
  const { close } = useNav()
  const { pageColor } = usePageColor()
  const refContainer = useRef<HTMLDivElement>(null)

  const style = useMemo(() => ({ backgroundColor: pageColor }), [pageColor])

  useClickAway(refContainer, (e) => {
    const btnMenu = document.getElementById("nav-menu-button")
    const target = e.target as Node

    // prevent double toggle
    if (btnMenu === target || btnMenu?.contains(target)) return

    close()
  })

  return (
    <div
      ref={refContainer}
      className="flex w-full flex-col gap-2 rounded-b p-3 sm:grid sm:grid-cols-3"
      style={style}
    >
      {children}
    </div>
  )
}

export const Nav = () => {
  const { url, balance } = useTreasury()
  const { isOpen } = useNav()

  return (
    <div className="fixed z-10 w-full max-w-5xl overflow-hidden">
      <Transition
        as="nav"
        show={isOpen}
        enter="transition-all ease-linear duration-300"
        enterFrom="translate-y-[-100%]"
        enterTo="translate-y-0"
        leave="transition-all ease-linear duration-300"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-[-100%]"
      >
        <NavContainer>
          <LocalLink to="/" icon={IconSpeakerphone}>
            Auction
          </LocalLink>
          <LocalLink to="/crests" icon={IconLayoutGrid}>
            All Crests
          </LocalLink>
          {!!balance && !!url && (
            <ExternalLink href={url} icon={IconBuildingBank}>
              Treasury
            </ExternalLink>
          )}
          <ExternalLink href={URL_TALLY} icon={IconGavel}>
            Governance
          </ExternalLink>
          <ExternalLink href={URL_DOCUMENTATION} icon={IconHelp}>
            Documentation
          </ExternalLink>
          <ExternalLink href={URL_MARKETPLACE} icon={IconShoppingCart}>
            Marketplace
          </ExternalLink>
          <ExternalLink href={URL_DISCORD} icon={IconBrandDiscord}>
            Discord
          </ExternalLink>
          <LocalLink to="/playground" icon={IconAdjustments}>
            <div>Playground</div>
          </LocalLink>
          <LocalLink to="/contracts" icon={IconSettings}>
            <div>Contracts</div>
          </LocalLink>
        </NavContainer>
      </Transition>
    </div>
  )
}
