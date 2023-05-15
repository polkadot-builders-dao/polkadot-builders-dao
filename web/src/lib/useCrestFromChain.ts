import { useMemo } from "react"
import { useCrestTokenUri } from "../contracts/generated"
import { CHAIN_ID } from "./settings"

export type CrestMetadataAttributes =
  | "Background"
  | "Noggles"
  | "Crown"
  | "Doodads"
  | "Quadrant Palette 1"
  | "Quadrant Palette 2"
  | "Rep"
  | "Skill"
  | "Class"
  | "Trait"

export type CrestMetadata = {
  name: string
  description: string
  attributes: {
    trait_type: CrestMetadataAttributes
    value: string
  }[]
}

export const useCrestDetailsFromData = (data?: string) => {
  return useMemo(() => {
    if (typeof data !== "string") return { image: undefined, metadata: undefined }
    const json = atob(data.replace("data:application/json;base64,", ""))
    const { image, ...metadata } = JSON.parse(json)
    return { image, metadata } as { image: string; metadata: CrestMetadata }
  }, [data])
}

export const useCrestFromChain = (tokenId?: bigint) => {
  const id = tokenId ? BigInt(tokenId) : 0n

  const call = useCrestTokenUri({
    args: [id],
    enabled: id > 0n,
    chainId: CHAIN_ID,
  })

  const { image, metadata } = useCrestDetailsFromData(call.data)

  // eslint-disable-next-line no-console
  if (call.error) console.log({ tokenId, call })

  return { ...call, image, metadata }
}
