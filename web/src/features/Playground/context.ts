import { BigNumber } from "ethers"
import { useCallback, useState } from "react"
import { useProvider } from "wagmi"
import {
  partsStoreAddress,
  useDnaManager,
  usePartsStore,
  useTokenGeneratorGenerateTokenUri,
} from "../../contracts/generated"
import { provideContext } from "../../lib/provideContext"
import { CHAIN_ID } from "../../lib/settings"
import { useCrestDetailsFromData } from "../../lib/useCrestFromChain"

const usePlaygroundProvider = () => {
  const [dna, setDna] = useState("0")
  const provider = useProvider({ chainId: CHAIN_ID })
  const storeContract = usePartsStore({
    signerOrProvider: provider,
    chainId: CHAIN_ID,
  })
  const dnaContract = useDnaManager({
    signerOrProvider: provider,
    chainId: CHAIN_ID,
  })

  const { data, error } = useTokenGeneratorGenerateTokenUri({
    args: [partsStoreAddress[CHAIN_ID], BigNumber.from(0), BigNumber.from(dna)],
    chainId: CHAIN_ID,
  })

  const { image, metadata } = useCrestDetailsFromData(data)

  const handleRandom = useCallback(async () => {
    try {
      if (!dnaContract || !storeContract) return

      const test = await dnaContract.generateDna(storeContract.address, BigNumber.from(Date.now()))

      setDna(test.toString())
    } catch (err) {
      console.error(err)
    }
  }, [dnaContract, storeContract])

  return { dna, setDna, image, metadata, handleRandom, error }
}

export const [PlaygroundProvider, usePlayground] = provideContext(usePlaygroundProvider)
