// import { BigNumber, ethers } from "ethers"
// import { FC, useCallback, useMemo, useState } from "react"
// import { useContractRead, useProvider } from "wagmi"
// import { Button } from "../../components/Button"
// // import { PB_TOKEN, PB_TOKEN_COMPOSER, PB_TOKEN_PARTS_STORE } from "../../lib/contract"
// import { CHAIN_ID } from "../../lib/settings"
// //import { DnaEditor } from "./DnaEditor"

// export const Playground: FC = () => {
//   const [dna, setDna] = useState("0")
//   const provider = useProvider({ chainId: CHAIN_ID })

//   const { data, error, isFetching } = useContractRead({
//     ...PB_TOKEN,
//     functionName: "generateMetadata",
//     args: [0, dna],
//   })

//   const { image, metadata } = useMemo(() => {
//     if (typeof data !== "string") return { image: undefined, metadata: undefined }
//     console.time("decode")
//     const json = atob(data.replace("data:application/json;base64,", ""))
//     const { image, ...metadata } = JSON.parse(json)
//     console.timeEnd("decode")
//     return { image, metadata }
//   }, [data])

//   const handleRandom = useCallback(async () => {
//     try {
//       const store = new ethers.Contract(
//         PB_TOKEN_PARTS_STORE.address,
//         PB_TOKEN_PARTS_STORE.abi,
//         provider
//       )
//       console.time("generateDna")
//       const test: BigNumber = await store.generateDna(Date.now())
//       console.timeEnd("generateDna")
//       setDna(test.toString())
//       console.log(test)
//     } catch (err) {
//       console.error(err)
//     }
//   }, [provider])

//   return (
//     <div className="flex w-full flex-col">
//       <h1 className="text-polkadot-500 mb-3 w-full text-left text-3xl font-bold ">Playground</h1>
//       {/*
//       <DnaEditor dna={dna} onChange={setDna} /> */}

//       <div className="flex w-full gap-8">
//         <div className="h-64 w-64 rounded-xl bg-neutral-800">
//           {image && <img alt="" src={image} className="rounded-xl" />}
//         </div>
//         <div className="flex h-64 grow flex-col justify-between gap-8 text-center">
//           <div>DNA {dna}</div>
//           <div className="grow">
//             <Button onClick={handleRandom} className="inline-block w-auto">
//               Random
//             </Button>
//           </div>
//           <div>
//             {error && <div className="text-brand-orange">{error.message}</div>}
//             {isFetching && <div>Querying smart contract</div>}
//           </div>
//         </div>
//       </div>
//       <div className="flex w-full justify-center text-center"></div>

//       <div className="mt-4 w-full rounded-xl bg-neutral-800 p-4">
//         <pre className="h-[300px] overflow-auto text-sm ">
//           {metadata && JSON.stringify(metadata, undefined, 2)}
//         </pre>
//       </div>
//     </div>
//   )
// }

export default {}
