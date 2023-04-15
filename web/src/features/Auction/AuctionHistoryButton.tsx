import { FC, PropsWithChildren } from "react"
import { useOpenClose } from "../../lib/useOpenClose"
import { CrestDetailsDrawer } from "../../components/CrestDetailsDrawer/CrestDetailsDrawer"

type AuctionHistoryButton = {
  tokenId: string
  className?: string
} & PropsWithChildren

export const AuctionHistoryButton: FC<AuctionHistoryButton> = ({
  tokenId,
  className,
  children,
}) => {
  const { open, close, isOpen } = useOpenClose()

  if (!tokenId) return null

  return (
    <>
      <button type="button" className={className} onClick={open}>
        {children ?? (
          <>
            <span className="hidden sm:inline">View bids history</span>
            <span className="inline sm:hidden">Bids history</span>
          </>
        )}
      </button>
      {!!tokenId && <CrestDetailsDrawer tokenId={tokenId} show={isOpen} onDismiss={close} />}
    </>
  )
}
