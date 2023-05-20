import { useNav } from "./NavContext"
import classNames from "classnames"

export const NavMenuButton = () => {
  const { toggle, isOpen } = useNav()

  return (
    <button
      id="nav-menu-button" // id used to prevent double toggle
      type="button"
      onClick={toggle}
      className={classNames("btn secondary", !isOpen && "border-none")}
    >
      Menu
    </button>
  )
}
