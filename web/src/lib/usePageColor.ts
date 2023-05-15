import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { provideContext } from "./provideContext"

const DEFAULT_COLOR = "#0a0a0a"

const usePageColorProvider = () => {
  const location = useLocation()
  const [pageColor, setPageColor] = useState(DEFAULT_COLOR)

  useEffect(() => {
    setPageColor(DEFAULT_COLOR)
  }, [location.pathname])

  useEffect(() => {
    const layout = document.getElementById("layout")
    if (!layout) return
    layout.style.backgroundColor = pageColor
  }, [pageColor])

  return {
    pageColor,
    setPageColor,
  }
}

export const [PageColorProvider, usePageColor] = provideContext(usePageColorProvider)
