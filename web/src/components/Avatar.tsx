import { AvatarComponent } from "@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/AvatarContext"
import { TalismanOrb } from "@talismn/orb"

export const Avatar: AvatarComponent = ({ address, size }) => {
  return <TalismanOrb seed={address} width={size} height={size} />
}
