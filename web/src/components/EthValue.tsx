import { BigNumber, BigNumberish } from "ethers"
import { formatEther } from "ethers/lib/utils.js"
import { FC, useMemo } from "react"
import { CHAIN_ID } from "../lib/settings"
import { useNativeCurrency } from "../lib/useNativeCurrency"
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip"

const getEthValueFormat = (wei: BigNumberish) => {
  const bn = BigNumber.from(wei)
  const full = formatEther(bn)
  const [integer, decimals] = full.split(".")

  const safeDecimals = decimals.replace(/0+$/, "")

  const compact =
    integer.length >= 4 || !safeDecimals
      ? integer
      : `${integer}.${decimals.slice(0, 4 - integer.length)}`

  return { full, compact }
}

export const EthValue: FC<{ wei: BigNumberish }> = ({ wei }) => {
  const currency = useNativeCurrency(CHAIN_ID)

  const displayValue = useMemo(() => getEthValueFormat(wei), [wei])

  if (!displayValue || !currency) return null

  return (
    <Tooltip>
      <TooltipTrigger>
        {displayValue.compact} {currency.symbol}
      </TooltipTrigger>
      <TooltipContent className="z-50 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-400">
        {formatEther(wei)} {currency.symbol}
      </TooltipContent>
    </Tooltip>
  )
}
