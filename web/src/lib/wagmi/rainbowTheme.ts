import { darkTheme, Theme } from "@rainbow-me/rainbowkit"

const dark = darkTheme({
  accentColor: "#E6007A",
  accentColorForeground: "#fafafa",
  borderRadius: "small",
})

export const rainbowTheme: Theme = {
  ...dark,
  colors: {
    ...dark.colors,
    connectButtonBackground: "#171717",
    connectButtonInnerBackground: "#262626",
  },
  fonts: {
    body: "inherit",
  },
}
