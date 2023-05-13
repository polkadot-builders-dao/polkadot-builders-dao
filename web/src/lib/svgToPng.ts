import { Canvg, RenderingContext2D, presets } from "canvg"
import { showToastAlert } from "../components/ToastAlert"

const preset = presets.offscreen()

const svgToPng = async (svg: string, width = 500, height = 500) => {
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext("2d")
  const v = await Canvg.from(ctx as RenderingContext2D, svg, preset)

  // Render only first frame, ignoring animations and mouse.
  await v.render()

  return canvas.convertToBlob()
}

const download = (href: string, filename: string) => {
  const a = document.createElement("a")
  a.href = href
  a.download = filename
  document.body.appendChild(a)

  a.click()

  document.body.removeChild(a)
}

export const copySvgAsPng = async (svg: string) => {
  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": svgToPng(svg) })])

    showToastAlert("success", "Success", "Image copied to clipboard", {
      autoClose: 3000,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to copy image", err)

    showToastAlert("error", "Failed", "Could not copy image to clipboard", {
      autoClose: 3000,
    })
  }
}

export const downloadSvgAsPng = async (svg: string, filename: string) => {
  try {
    const image = await svgToPng(svg)
    download(URL.createObjectURL(image), filename)
  } catch (err) {
    showToastAlert("error", "Failed", "Failed to generate image", {
      autoClose: 3000,
    })
  }
}
