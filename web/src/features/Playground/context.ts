import { useCallback, useState } from "react"
import {
  dnaManagerABI,
  dnaManagerAddress,
  partsStoreAddress,
  useTokenGeneratorGenerateTokenUri,
} from "../../contracts/generated"
import { provideContext } from "../../lib/provideContext"
import { CHAIN_ID } from "../../lib/settings"
import { useCrestDetailsFromData } from "../../lib/useCrestFromChain"
import { getContract } from "wagmi/actions"

const usePlaygroundProvider = () => {
  const [dna, setDna] = useState("0")

  const { data, error } = useTokenGeneratorGenerateTokenUri({
    args: [partsStoreAddress[CHAIN_ID], 0n, BigInt(dna)],
    chainId: CHAIN_ID,
  })

  const { image, metadata } = useCrestDetailsFromData(data)

  const handleRandom = useCallback(async () => {
    try {
      const dnaContract = getContract({
        address: dnaManagerAddress[CHAIN_ID],
        abi: dnaManagerABI,
        chainId: CHAIN_ID,
      })

      const randomDna = await dnaContract.read.generateDna([
        partsStoreAddress[CHAIN_ID],
        BigInt(Date.now()),
      ])

      setDna(randomDna.toString())
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }, [])

  return { dna, setDna, image, metadata, handleRandom, error }
}

export const [PlaygroundProvider, usePlayground] = provideContext(usePlaygroundProvider)
