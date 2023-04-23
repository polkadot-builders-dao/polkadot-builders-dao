import { FC, PropsWithChildren, forwardRef, useMemo } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip"
import { useBlockExplorerUrl } from "../lib/useBlockExplorerUrl"
import { CHAIN_ID } from "../lib/settings"
import { shortenAddress } from "../lib/shortenAddress"
import classNames from "classnames"
import { Avatar } from "./Avatar"
import { IconExternalLink } from "@tabler/icons-react"

export type EthAddressProps = {
  address?: `0x${string}`
  shorten?: boolean
  className?: string
  withAvatar?: boolean
  avatarSize?: number
  withHref?: boolean
}

const EthAddressContent: FC<PropsWithChildren & { href?: string }> = forwardRef<
  HTMLAnchorElement,
  React.HTMLProps<HTMLElement>
>(({ href, children }, ref) => {
  return href ? (
    <a ref={ref} href={href} target="_blank" className="flex items-center hover:text-neutral-300">
      <span>{children}</span>
      <IconExternalLink className="inline h-[0.9em] w-[0.9em]" />
    </a>
  ) : (
    <span ref={ref} className="flex items-center">
      {children}
    </span>
  )
})

export const EthAddress: FC<EthAddressProps> = ({
  address,
  withAvatar,
  avatarSize = 16,
  shorten,
  withHref,
  className,
}) => {
  const blockExplorerUrl = useBlockExplorerUrl(CHAIN_ID)
  const href = useMemo(
    () => (withHref ? `${blockExplorerUrl}/address/${address}` : undefined),
    [blockExplorerUrl, withHref, address]
  )

  if (!address) return null

  return (
    <Tooltip>
      <TooltipTrigger
        asChild
        className={classNames(withHref ? "cursor-pointer" : "cursor-default", className)}
      >
        <EthAddressContent href={href}>
          {!!withAvatar && <Avatar size={avatarSize} address={address} />}
          {shorten ? shortenAddress(address) : address}
        </EthAddressContent>
      </TooltipTrigger>
      <TooltipContent>{address}</TooltipContent>
    </Tooltip>
  )
}
