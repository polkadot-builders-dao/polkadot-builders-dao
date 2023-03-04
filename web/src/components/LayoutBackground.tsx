import { FC, useEffect } from "react"
import { getBackgroundColorCode } from "../lib/getBackgroundColorCode"
import { CrestMetadata } from "../lib/useCrestDetails"

const applyLayoutColor = (color: string) => {
  const layout = document.getElementById("layout")
  if (!layout) return
  layout.style.backgroundColor = color
}

type LayoutBackgroundProps = {
  metadata?: CrestMetadata
  force?: "Teal" | "Hibiscus" | "Blue" | "Purple" | "Gray"
}

export const LayoutBackground: FC<LayoutBackgroundProps> = ({ metadata, force }) => {
  useEffect(() => {
    if (!metadata) return

    const colorName = metadata.attributes?.find((attr) => attr.trait_type === "Background")?.value
    const colorCode = getBackgroundColorCode(force ?? colorName)
    applyLayoutColor(colorCode)
  }, [force, metadata])

  return null
}
