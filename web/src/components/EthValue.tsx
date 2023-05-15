import { FC, useMemo } from "react"
import { CHAIN_ID } from "../lib/settings"
import { useNativeCurrency } from "../lib/useNativeCurrency"
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip"
import { formatEther } from "viem"

const getEthValueFormat = (wei: bigint) => {
  const full = formatEther(wei)
  const [integer, decimals = ""] = full.split(".")

  const safeDecimals = decimals.replace(/0+$/, "")

  const compact =
    integer.length >= 4 || !safeDecimals
      ? integer
      : `${integer}.${decimals.slice(0, 4 - integer.length)}`

  return { full, compact }
}

export const EthValue: FC<{ wei: bigint }> = ({ wei }) => {
  const currency = useNativeCurrency(CHAIN_ID)

  const displayValue = useMemo(() => getEthValueFormat(wei), [wei])

  if (!displayValue || !currency) return null

  return (
    <Tooltip>
      <TooltipTrigger>
        {displayValue.compact} {currency.symbol}
      </TooltipTrigger>
      <TooltipContent>
        {formatEther(wei)} {currency.symbol}
      </TooltipContent>
    </Tooltip>
  )
}
