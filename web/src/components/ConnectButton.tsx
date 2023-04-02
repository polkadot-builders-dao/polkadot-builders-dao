import classNames from "classnames"
import { FC, useCallback, useRef } from "react"
import { shortenAddress } from "../lib/shortenAddress"
import { useHoverDirty } from "react-use"
import { useWallet } from "../lib/useWallet"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"

type ConnectButtonProps = {
  className?: string
}

export const ConnectButton: FC<ConnectButtonProps> = ({ className }) => {
  const { connect, disconnect, isConnected, address, isJustAfterConnect } = useWallet()

  const refButton = useRef<HTMLButtonElement>(null)
  const isHovered = useHoverDirty(refButton)

  const handleClick = useCallback(() => {
    if (isConnected) disconnect()
    else connect()
  }, [connect, disconnect, isConnected])

  return (
    <button
      onClick={handleClick}
      className={classNames("btn", isConnected ? "secondary" : "primary")}
      type="button"
    >
      {address ? (
        <div className="flex w-full items-center justify-center gap-2">
          <Jazzicon diameter={20} seed={jsNumberForAddress(address)} />
          <span className="hidden sm:block">{shortenAddress(address as string, 4, 4)}</span>
        </div>
      ) : (
        "Connect"
      )}
    </button>
  )

  return (
    <button
      ref={refButton}
      className={classNames(
        "relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2 font-normal transition-colors",
        isConnected
          ? "bg-neutral-800 text-neutral-400"
          : "bg-neutral-500 text-neutral-950 hover:bg-neutral-400",
        className
      )}
      onClick={handleClick}
    >
      <span className="grow text-center proportional-nums">
        {address ? shortenAddress(address as string, 4, 4) : "Connect"}
      </span>
      <div
        className={classNames(
          "absolute left-0 top-0 flex h-full w-full items-center justify-center gap-2 bg-white  text-center text-neutral-950 opacity-0 transition-opacity",
          isConnected && !isJustAfterConnect && isHovered && "opacity-100"
        )}
      >
        {/* <PowerIcon /> */}
        <span className="">Disconnect</span>
      </div>
    </button>
  )
}
