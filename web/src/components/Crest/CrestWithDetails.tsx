import classNames from "classnames"
import { useOpenClose } from "../../lib/useOpenClose"
import { CrestDetailsDrawer } from "../CrestDetailsDrawer/CrestDetailsDrawer"

export const CrestWithDetails = ({
  token,
  className,
}: {
  token: { id: string; image: string }
  className?: string
}) => {
  const { open, close, isOpen } = useOpenClose()

  return (
    <>
      <button className={className} onClick={open}>
        <img
          loading="lazy"
          className={classNames("h-[300px] w-[300px] rounded-xl")}
          src={token.image}
          alt=""
        />
        <div className="mt-2 text-center">#{token.id}</div>
      </button>
      <CrestDetailsDrawer tokenId={token.id} show={isOpen} onDismiss={close} />
    </>
  )
}
