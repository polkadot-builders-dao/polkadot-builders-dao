import { AvatarComponent } from "@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/AvatarContext"
import { useMemo } from "react"
import { jsNumberForAddress } from "react-jazzicon"
import Jazzicon from "react-jazzicon/dist/Jazzicon"

export const Avatar: AvatarComponent = ({ address, size }) => {
  const seed = useMemo(() => jsNumberForAddress(address), [address])

  return <Jazzicon diameter={size} seed={seed} />
}
