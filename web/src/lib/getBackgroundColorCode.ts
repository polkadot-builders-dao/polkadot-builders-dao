export const getBackgroundColorCode = (colorName?: string) => {
  switch (colorName) {
    case "Teal":
      return "#0F3B4A"
    case "Hibiscus":
      return "#9E1F63"
    case "Blue":
      return "#1C75BC"
    case "Purple":
      return "#733795"
    case "Gray":
      return "#414042"
    default:
      return "transparent"
  }
}
