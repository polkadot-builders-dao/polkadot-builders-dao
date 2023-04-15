import { BigNumber } from "ethers"
import { FC, useCallback, useMemo } from "react"
import { Dropdown } from "../../components/Dropdown"
import { usePartsStoreGetAllParts } from "../../contracts/generated"
import { CHAIN_ID } from "../../lib/settings"
import { usePlayground } from "./context"

type PartEditorProps = {
  label: string
  parts: readonly string[]
  selectedIndex: number
  onSelect: (index: number) => void
}

const PartEditor: FC<PartEditorProps> = ({ label, parts, selectedIndex = 0, onSelect }) => {
  const options = parts.map((value, i) => ({
    value: i.toString(),
    label: value,
  }))

  const handleSelect = useCallback(
    (value: string) => {
      onSelect(Number(value))
    },
    [onSelect]
  )

  return (
    <div>
      <div className="text-neutral-300">{label}</div>
      <div>
        <Dropdown items={options} value={String(selectedIndex)} onSelect={handleSelect} />
      </div>
    </div>
  )
}

export const DnaEditor = () => {
  const { dna, setDna } = usePlayground()
  const { data: parts } = usePartsStoreGetAllParts({
    chainId: CHAIN_ID,
  })

  const [
    bgColorId,
    nogglesColorId,
    crownId,
    doodadId,
    garlandId,
    shieldId,
    quadrantPalette1Id,
    quadrantPalette2Id,
    repId,
    skillId,
    classId,
    traitId,
  ] = useMemo(() => {
    const bnDna = BigNumber.from(dna)
    return [
      bnDna.mask(8).toNumber(),
      bnDna.shr(8).mask(8).toNumber(),
      bnDna.shr(16).mask(8).toNumber(),
      bnDna.shr(24).mask(8).toNumber(),
      bnDna.shr(32).mask(8).toNumber(),
      bnDna.shr(40).mask(8).toNumber(),
      bnDna.shr(48).mask(8).toNumber(),
      bnDna.shr(56).mask(8).toNumber(),
      bnDna.shr(64).mask(8).toNumber(),
      bnDna.shr(72).mask(8).toNumber(),
      bnDna.shr(80).mask(8).toNumber(),
      bnDna.shr(88).mask(8).toNumber(),
    ]
  }, [dna])

  const handleSelect = useCallback(
    (shift: number) => (index: number) => {
      const bnDna = BigNumber.from(dna)
      const oldIndex = bnDna.shr(shift).mask(8)
      const bnOldValue = BigNumber.from(oldIndex).shl(shift)
      const bnNewValue = BigNumber.from(index).shl(shift)

      const newDna = bnDna.sub(bnOldValue).add(bnNewValue).toString()

      setDna(newDna)
    },
    [dna, setDna]
  )

  if (!parts) return null

  return (
    <div>
      <div>DNA {dna}</div>
      <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
        <PartEditor
          label="Background"
          parts={parts.bgColors}
          selectedIndex={bgColorId}
          onSelect={handleSelect(0)}
        />
        <PartEditor
          label="Noggles"
          parts={parts.nogglesColors}
          selectedIndex={nogglesColorId}
          onSelect={handleSelect(8)}
        />
        <PartEditor
          label="Quadrants Palette 1"
          parts={parts.quadrantPalettes}
          selectedIndex={quadrantPalette1Id}
          onSelect={handleSelect(48)}
        />
        <PartEditor
          label="Quadrants Palette 2"
          parts={parts.quadrantPalettes}
          selectedIndex={quadrantPalette2Id}
          onSelect={handleSelect(56)}
        />
        <PartEditor
          label="Rep"
          parts={parts.reps}
          selectedIndex={repId}
          onSelect={handleSelect(64)}
        />
        <PartEditor
          label="Skill"
          parts={parts.skills}
          selectedIndex={skillId}
          onSelect={handleSelect(72)}
        />
        <PartEditor
          label="Class"
          parts={parts.classes}
          selectedIndex={classId}
          onSelect={handleSelect(80)}
        />
        <PartEditor
          label="Trait"
          parts={parts.traits}
          selectedIndex={traitId}
          onSelect={handleSelect(88)}
        />
        <PartEditor
          label="Crown"
          parts={parts.crowns}
          selectedIndex={crownId}
          onSelect={handleSelect(16)}
        />
        <PartEditor
          label="Doodads"
          parts={parts.doodads}
          selectedIndex={doodadId}
          onSelect={handleSelect(24)}
        />
      </div>
    </div>
  )
}
