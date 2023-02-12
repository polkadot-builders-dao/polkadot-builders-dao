import classNames from "classnames"
import { BigNumber } from "ethers"
import { FC, useCallback, useMemo, useState } from "react"
import { useProvider } from "wagmi"
import { Button } from "../../components/Button"
import {
  pbTokenPartsStoreAddress,
  usePbTokenComposerGetTokenMetadata,
  usePbTokenDna,
  usePbTokenPartsStore,
} from "../../contracts/generated"
import { CHAIN_ID } from "../../lib/settings"
import { DnaEditor } from "./DnaEditor"

export const Playground: FC = () => {
  const [dna, setDna] = useState("0")
  const provider = useProvider({ chainId: CHAIN_ID })
  const storeContract = usePbTokenPartsStore({
    signerOrProvider: provider,
    chainId: CHAIN_ID,
  })
  const dnaContract = usePbTokenDna({
    signerOrProvider: provider,
    chainId: CHAIN_ID,
  })

  const { data, error } = usePbTokenComposerGetTokenMetadata({
    args: [pbTokenPartsStoreAddress[CHAIN_ID], BigNumber.from(0), BigNumber.from(dna)],
    chainId: CHAIN_ID,
  })

  const { image, metadata } = useMemo(() => {
    if (typeof data !== "string") return { image: undefined, metadata: undefined }
    const json = atob(data.replace("data:application/json;base64,", ""))
    const { image, ...metadata } = JSON.parse(json)
    return { image, metadata }
  }, [data])

  const handleRandom = useCallback(async () => {
    try {
      if (!dnaContract || !storeContract) return

      const test = await dnaContract.generateDna(storeContract.address, BigNumber.from(Date.now()))

      setDna(test.toString())
    } catch (err) {
      console.error(err)
    }
  }, [dnaContract, storeContract])

  return (
    <div>
      <div className="flex items-center">
        <div className="grow">
          <h1 className="text-3xl font-bold text-neutral-300">Playground</h1>
          <div className="text-neutral-500">DNA {dna}</div>
        </div>
        <button type="button" onClick={handleRandom} className="primary">
          Random
        </button>
      </div>
      <div className="my-8 flex w-full flex-col gap-8">
        <DnaEditor dna={dna} onChange={setDna} />
        <div className="flex w-full gap-8">
          <div
            className={classNames(
              "h-80 w-80 rounded-xl bg-neutral-800 ",
              !image && "animate-pulse"
            )}
          >
            {image && <img alt="" src={image} className="rounded-xl" />}
          </div>
          <div className="grow">
            <pre
              className={classNames(
                "h-80 overflow-auto rounded-xl bg-neutral-800 p-4 text-sm",
                !metadata && "animate-pulse"
              )}
            >
              {metadata && JSON.stringify(metadata, undefined, 2)}
            </pre>
          </div>
        </div>
      </div>
      <div className="text-red-500">{error?.message}</div>
    </div>
  )
}

export default {}
