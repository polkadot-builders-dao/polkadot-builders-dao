import { BigNumber, BigNumberish } from "ethers"
import { useMemo } from "react"
import { usePbTokenTokenUri } from "../contracts/generated"

export const usePBTokenDetails = (tokenId?: BigNumberish) => {
  const id = tokenId ? BigNumber.from(tokenId) : BigNumber.from(0)

  const call = usePbTokenTokenUri({
    args: [id],
    enabled: id.gt(0),
  })

  const { image, metadata } = useMemo(() => {
    if (typeof call.data !== "string") return { image: undefined, metadata: undefined }
    const json = atob(call.data.replace("data:application/json;base64,", ""))
    const { image, ...metadata } = JSON.parse(json)
    return { image, metadata }
  }, [call.data])

  return { ...call, image, metadata }
}
