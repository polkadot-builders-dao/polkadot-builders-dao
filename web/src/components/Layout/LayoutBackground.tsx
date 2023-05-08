import { FC, useEffect } from "react"
import { getBackgroundColorCode } from "../../lib/getBackgroundColorCode"
import { CrestMetadata } from "../../lib/useCrestFromChain"
import { usePageColor } from "../../lib/usePageColor"

type LayoutBackgroundProps = {
  metadata?: CrestMetadata
  force?: "Teal" | "Hibiscus" | "Blue" | "Purple" | "Gray"
}

export const LayoutBackground: FC<LayoutBackgroundProps> = ({ metadata, force }) => {
  const { setPageColor } = usePageColor()
  useEffect(() => {
    if (!metadata) return

    const colorName = metadata.attributes?.find((attr) => attr.trait_type === "Background")?.value
    const colorCode = getBackgroundColorCode(force ?? colorName)
    setPageColor(colorCode)
  }, [force, metadata, setPageColor])

  return null
}
