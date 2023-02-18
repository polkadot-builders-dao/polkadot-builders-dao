import "react-toastify/dist/ReactToastify.min.css"
import "./styles/styles.css"

import React from "react"
import ReactDOM from "react-dom/client"
import { WagmiConfig } from "wagmi"
import { wagmiClient } from "./lib/wagmi/wagmiClient"
import { ToastContainer } from "react-toastify"

import { WalletProvider } from "./lib/useWallet"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { PlaygroundPage } from "./routes/PlaygroundPage"
import { HomePage } from "./routes/HomePage"
import { MyCrestsPAge } from "./routes/MyCrestsPage"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <WalletProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/my-crests" element={<MyCrestsPAge />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer hideProgressBar closeOnClick pauseOnHover closeButton={false} />
        </WalletProvider>
      </BrowserRouter>
    </WagmiConfig>
  </React.StrictMode>
)
