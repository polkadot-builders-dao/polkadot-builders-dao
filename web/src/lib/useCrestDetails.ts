import { BigNumber, BigNumberish } from "ethers"
import { useMemo } from "react"
import { useCrestTokenUri } from "../contracts/generated"
import { CHAIN_ID } from "./settings"

export const useCrestDetails = (tokenId?: BigNumberish) => {
  const id = tokenId ? BigNumber.from(tokenId) : BigNumber.from(0)

  const call = useCrestTokenUri({
    args: [id],
    enabled: id.gt(0),
    chainId: CHAIN_ID,
  })

  const { image, metadata } = useMemo(() => {
    if (typeof call.data !== "string") return { image: undefined, metadata: undefined }
    const json = atob(call.data.replace("data:application/json;base64,", ""))
    const { image, ...metadata } = JSON.parse(json)
    return { image, metadata }
  }, [call.data])

  return { ...call, image, metadata }
}
