import { darkTheme, Theme } from "@rainbow-me/rainbowkit"

const dark = darkTheme({
  accentColor: "#E6007A",
  accentColorForeground: "#fafafa",
  borderRadius: "small",
})

console.log("dark", dark)

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

//     : Theme = {
//   blurs: {
//     modalOverlay: "...",
//   },
//   colors: {
//     accentColor: "...",
//     accentColorForeground: "...",
//     actionButtonBorder: "...",
//     actionButtonBorderMobile: "...",
//     actionButtonSecondaryBackground: "...",
//     closeButton: "...",
//     closeButtonBackground: "...",
//     connectButtonBackground: "...",
//     connectButtonBackgroundError: "...",
//     connectButtonInnerBackground: "...",
//     connectButtonText: "...",
//     connectButtonTextError: "...",
//     connectionIndicator: "...",
//     downloadBottomCardBackground: "...",
//     downloadTopCardBackground: "...",
//     error: "...",
//     generalBorder: "...",
//     generalBorderDim: "...",
//     menuItemBackground: "...",
//     modalBackdrop: "...",
//     modalBackground: "...",
//     modalBorder: "...",
//     modalText: "...",
//     modalTextDim: "...",
//     modalTextSecondary: "...",
//     profileAction: "...",
//     profileActionHover: "...",
//     profileForeground: "...",
//     selectedOptionBorder: "...",
//     standby: "...",
//   },
//   fonts: {
//     body: "...",
//   },
//   radii: {
//     actionButton: "...",
//     connectButton: "...",
//     menuButton: "...",
//     modal: "...",
//     modalMobile: "...",
//   },
//   shadows: {
//     connectButton: "...",
//     dialog: "...",
//     profileDetailsAction: "...",
//     selectedOption: "...",
//     selectedWallet: "...",
//     walletLogo: "...",
//   },
// }
