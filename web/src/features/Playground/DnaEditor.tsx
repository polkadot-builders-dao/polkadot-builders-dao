// import { BigNumber, ethers } from "ethers"
// import { FC, useCallback, useEffect, useMemo } from "react"
// import { useContractRead, useProvider } from "wagmi"
// import { PB_TOKEN_PARTS_STORE } from "../../lib/contract"
// import { CHAIN_ID } from "../../lib/settings"
// import { Fragment, useState } from "react"
// import { Listbox, Transition } from "@headlessui/react"
// import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
// import { Dropdown } from "../../components/Dropdown"

// const PARTS = {
//   bgColors: ["#0F3B4A", "#9E1F63", "#1C75BC", "#733795", "#414042"],
//   googleColors: ["#BE1E2D", "#EF4136", "#BDD5EC", "#FBAB18", "#F26122", "#58595B", "#8A82BD"],
//   crowns: ["Crown 1", "Crown 2", "Crown 3", "Halo", "Horns"],
//   decorations: ["Circles", "Diamonds", "Flames", "Gems", "Stars"],
//   garlands: ["Garland 1"],
//   shields: ["Shield 1"],
//   logoPalettes: [
//     "#E40B7B-#FFFFFF",
//     "#BE1E2D-#F4D154",
//     "#0F3B4A-#00867E",
//     "#EF4136-#BDD5EC",
//     "#9E1F63-#C4DA5B",
//     "#BDD5EC-#1C75BC",
//     "#FBAB18-#733795",
//     "#F26122-#E40B7B",
//     "#58595B-#414042",
//     "#8A82BD-#F9A983",
//   ],
//   logos1: [
//     "Builder",
//     "Governance Fanatic",
//     "True Chad",
//     "DOT Enthusiast",
//     "Gavin Fan",
//     "Social Star",
//     "KSM Enthusiast",
//     "GLMR Enthusiast",
//   ],
//   logos2: [
//     "Full Stack Devstar",
//     "Community Manager",
//     "Solidity Developer",
//     "Node Runner",
//     "Marketing Master",
//     "Artist",
//     "Writer",
//     "Front-end Wizard",
//     "Security Expert",
//     "Rust Developer",
//   ],
//   logos3: [
//     "Piggy Banker",
//     "NFT Collector",
//     "Statistic Whiz",
//     "Photographer",
//     "Bridge Builder",
//     "Musician",
//     "Coin Stacker",
//     "Broadcaster",
//     "Digital Nomad",
//   ],
//   logos4: [
//     "Paper Hander",
//     "Early Bird",
//     "Diamond Hander",
//     "Night Owl",
//     "Visionary",
//     "Outdoorsy",
//     "Feline Friend",
//     "Canine Compatriot",
//   ],
// }

// const getParts = async (store: PBTokenPartsStore) => {
//   const [
//     bgColorsCount,
//     googlesColorsCount,
//     crowsCount,
//     decorationsCount,
//     garlandsCount,
//     shieldsCount,
//     logoPalettesCount,
//     logos1Count,
//     logos2Count,
//     logos3Count,
//     logos4Count,
//   ] = await Promise.all([
//     store.bgColorsCount(),
//     store.googlesColorsCount(),
//     store.crownsCount(),
//     store.decorationsCount(),
//     store.garlandsCount(),
//     store.shieldsCount(),
//     store.logoPalettesCount(),
//     store.logos1Count(),
//     store.logos2Count(),
//     store.logos3Count(),
//     store.logos4Count(),
//   ])

//   const bgColors = (
//     await Promise.all(
//       Array.from(Array(bgColorsCount.toNumber()).keys()).map((i) => store.getBgColor(i))
//     )
//   ).map((c) => c.name)
//   const googleColors = (
//     await Promise.all(
//       Array.from(Array(googlesColorsCount.toNumber()).keys()).map((i) => store.getGooglesColor(i))
//     )
//   ).map((c) => c.name)
//   const crowns = (
//     await Promise.all(Array.from(Array(crowsCount.toNumber()).keys()).map((i) => store.getCrown(i)))
//   ).map((c) => c.name)
//   const decorations = (
//     await Promise.all(
//       Array.from(Array(decorationsCount.toNumber()).keys()).map((i) => store.getDecoration(i))
//     )
//   ).map((c) => c.name)
//   const garlands = (
//     await Promise.all(
//       Array.from(Array(garlandsCount.toNumber()).keys()).map((i) => store.getGarland(i))
//     )
//   ).map((c) => c.name)
//   const shields = (
//     await Promise.all(
//       Array.from(Array(shieldsCount.toNumber()).keys()).map((i) => store.getShield(i))
//     )
//   ).map((c) => c.name)
//   const logoPalettes = (
//     await Promise.all(
//       Array.from(Array(logoPalettesCount.toNumber()).keys()).map((i) => store.getLogoPalette(i))
//     )
//   ).map((c) => c.name)
//   const logos1 = (
//     await Promise.all(
//       Array.from(Array(logos1Count.toNumber()).keys()).map((i) => store.getLogo1(i))
//     )
//   ).map((c) => c.name)
//   const logos2 = (
//     await Promise.all(
//       Array.from(Array(logos2Count.toNumber()).keys()).map((i) => store.getLogo2(i))
//     )
//   ).map((c) => c.name)
//   const logos3 = (
//     await Promise.all(
//       Array.from(Array(logos3Count.toNumber()).keys()).map((i) => store.getLogo3(i))
//     )
//   ).map((c) => c.name)
//   const logos4 = (
//     await Promise.all(
//       Array.from(Array(logos4Count.toNumber()).keys()).map((i) => store.getLogo4(i))
//     )
//   ).map((c) => c.name)

//   return {
//     bgColors,
//     googleColors,
//     crowns,
//     decorations,
//     garlands,
//     shields,
//     logoPalettes,
//     logos1,
//     logos2,
//     logos3,
//     logos4,
//   }
// }

// type PartEditorProps = {
//   label: string
//   parts: string[]
//   selectedIndex: number
//   onSelect: (index: number) => void
// }

// const PartEditor: FC<PartEditorProps> = ({ label, parts, selectedIndex = 0, onSelect }) => {
//   //const [value, setValue] = useState<string>()

//   const options = parts.map((value, i) => ({
//     value: i.toString(),
//     label: value,
//   }))

//   const handleSelect = useCallback(
//     (value: string) => {
//       onSelect(Number(value))
//     },
//     [onSelect]
//   )

//   return (
//     <div>
//       <div className="text-neutral-300">{label}</div>
//       <div>
//         <Dropdown items={options} value={String(selectedIndex)} onSelect={handleSelect} />
//       </div>
//     </div>
//   )
// }

// const useParts = () => {
//   const provider = useProvider({ chainId: CHAIN_ID })

//   useEffect(() => {
//     const store = PBTokenPartsStore__factory.connect(PB_TOKEN_PARTS_STORE.address, provider)

//     //PBTokenPartsStore__factory storeFactory = ethers.getContractFactory("PBTokenPartsStore")
//     // const store = new ethers.Contract<PBTokenPartsStore>(
//     //   PB_TOKEN_PARTS_STORE.address,
//     //   PB_TOKEN_PARTS_STORE.abi,
//     //   provider
//     // )
//     getParts(store).then(console.log).catch(console.error)
//   }, [provider])
// }

// type DnaEditorProps = {
//   dna: string
//   onChange: (dna: string) => void
// }

// export const DnaEditor: FC<DnaEditorProps> = ({ dna, onChange }) => {
//   const [
//     bgColorId,
//     googlesColorId,
//     crownId,
//     decorationId,
//     garlandId,
//     shieldId,
//     logoPalette1,
//     logoPalette2,
//     logo1,
//     logo2,
//     logo3,
//     logo4,
//   ] = useMemo(() => {
//     const bnDna = BigNumber.from(dna)
//     return [
//       bnDna.mask(8).toNumber(),
//       bnDna.shr(8).mask(8).toNumber(),
//       bnDna.shr(16).mask(8).toNumber(),
//       bnDna.shr(24).mask(8).toNumber(),
//       bnDna.shr(32).mask(8).toNumber(),
//       bnDna.shr(40).mask(8).toNumber(),
//       bnDna.shr(48).mask(8).toNumber(),
//       bnDna.shr(56).mask(8).toNumber(),
//       bnDna.shr(64).mask(8).toNumber(),
//       bnDna.shr(72).mask(8).toNumber(),
//       bnDna.shr(80).mask(8).toNumber(),
//       bnDna.shr(88).mask(8).toNumber(),
//     ]
//   }, [dna])

//   const handleSelect = useCallback(
//     (shift: number) => (index: number) => {
//       const bnDna = BigNumber.from(dna)
//       const oldIndex = bnDna.shr(shift).mask(8)
//       const bnOldValue = BigNumber.from(oldIndex).shl(shift)
//       const bnNewValue = BigNumber.from(index).shl(shift)

//       const newDna = bnDna.sub(bnOldValue).add(bnNewValue).toString()
//       console.log({ old: dna, new: newDna.toString() })
//       onChange(newDna)
//     },
//     [dna, onChange]
//   )

//   return (
//     <div className="grid grid-cols-3 gap-x-4 gap-y-2">
//       <PartEditor
//         label="Background"
//         parts={PARTS.bgColors}
//         selectedIndex={bgColorId}
//         onSelect={handleSelect(0)}
//       />
//       <PartEditor
//         label="Googles"
//         parts={PARTS.googleColors}
//         selectedIndex={googlesColorId}
//         onSelect={handleSelect(8)}
//       />
//       <PartEditor
//         label="Crown"
//         parts={PARTS.crowns}
//         selectedIndex={crownId}
//         onSelect={handleSelect(16)}
//       />
//       <PartEditor
//         label="Decoration"
//         parts={PARTS.decorations}
//         selectedIndex={decorationId}
//         onSelect={handleSelect(24)}
//       />
//       <PartEditor
//         label="Garland"
//         parts={PARTS.garlands}
//         selectedIndex={garlandId}
//         onSelect={handleSelect(32)}
//       />
//       <PartEditor
//         label="Shield"
//         parts={PARTS.shields}
//         selectedIndex={shieldId}
//         onSelect={handleSelect(40)}
//       />
//       <PartEditor
//         label="Palette 1"
//         parts={PARTS.logoPalettes}
//         selectedIndex={logoPalette1}
//         onSelect={handleSelect(48)}
//       />
//       <PartEditor
//         label="Palette 2"
//         parts={PARTS.logoPalettes}
//         selectedIndex={logoPalette2}
//         onSelect={handleSelect(56)}
//       />
//       <PartEditor
//         label="Logo 1"
//         parts={PARTS.logos1}
//         selectedIndex={logo1}
//         onSelect={handleSelect(64)}
//       />
//       <PartEditor
//         label="Logo 2"
//         parts={PARTS.logos2}
//         selectedIndex={logo2}
//         onSelect={handleSelect(72)}
//       />
//       <PartEditor
//         label="Logo 3"
//         parts={PARTS.logos3}
//         selectedIndex={logo3}
//         onSelect={handleSelect(80)}
//       />
//       <PartEditor
//         label="Logo 4"
//         parts={PARTS.logos4}
//         selectedIndex={logo4}
//         onSelect={handleSelect(88)}
//       />
//     </div>
//   )
// }

export default {}
