import { useCallback, useEffect, useMemo, useState } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { showToastAlert } from "../components/ToastAlert"
import { provideContext } from "./provideContext"
import { CHAIN_ID } from "./settings"

const useWalletProvider = () => {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const { disconnect } = useDisconnect()

  // used UI side to prevent the "Connect" button from flashing
  const [isJustAfterConnect, setIsJustAfterConnect] = useState(() => isConnected)

  const { connect: connectWallet, error: errorConnect } =
    useConnect()
    // {
    // chainId: CHAIN_ID,
    // connector: injectedConnector,
    // }

  useEffect(() => {
    if (errorConnect)
      showToastAlert("error", "Wallet connection failed", errorConnect.message, {
        autoClose: 3000,
      })
  }, [errorConnect])

  const connect = useCallback(() => {
    connectWallet()
    setIsJustAfterConnect(true)
    setTimeout(() => setIsJustAfterConnect(false), 1000)
  }, [connectWallet])

  const isFirstConnectionModalOpen = useMemo(
    () => isConnecting && !isReconnecting,
    [isConnecting, isReconnecting]
  )

  return {
    address,
    isConnected,
    isFirstConnectionModalOpen,
    isJustAfterConnect,
    connect,
    disconnect,
  }
}

export const [WalletProvider, useWallet] = provideContext(useWalletProvider)
