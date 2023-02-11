import { BigNumber } from "ethers"
import { FC, useCallback, useMemo } from "react"
import { Dropdown } from "../../components/Dropdown"
import { usePbTokenPartsStoreGetAllTraits } from "../../contracts/generated"

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

type DnaEditorProps = {
  dna: string
  onChange: (dna: string) => void
}

export const DnaEditor: FC<DnaEditorProps> = ({ dna, onChange }) => {
  const { data: traits } = usePbTokenPartsStoreGetAllTraits()

  const [
    bgColorId,
    googlesColorId,
    crownId,
    decorationId,
    garlandId,
    shieldId,
    logoPalette1,
    logoPalette2,
    logo1,
    logo2,
    logo3,
    logo4,
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
      console.log({ old: dna, new: newDna.toString() })
      onChange(newDna)
    },
    [dna, onChange]
  )

  if (!traits) return null

  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-2">
      <PartEditor
        label="Background"
        parts={traits.bgColors}
        selectedIndex={bgColorId}
        onSelect={handleSelect(0)}
      />
      <PartEditor
        label="Googles"
        parts={traits.googlesColors}
        selectedIndex={googlesColorId}
        onSelect={handleSelect(8)}
      />
      <PartEditor
        label="Crown"
        parts={traits.crowns}
        selectedIndex={crownId}
        onSelect={handleSelect(16)}
      />
      <PartEditor
        label="Decoration"
        parts={traits.decorations}
        selectedIndex={decorationId}
        onSelect={handleSelect(24)}
      />
      <PartEditor
        label="Garland"
        parts={traits.garlands}
        selectedIndex={garlandId}
        onSelect={handleSelect(32)}
      />
      <PartEditor
        label="Shield"
        parts={traits.shields}
        selectedIndex={shieldId}
        onSelect={handleSelect(40)}
      />
      <PartEditor
        label="Palette 1"
        parts={traits.logoPalettes}
        selectedIndex={logoPalette1}
        onSelect={handleSelect(48)}
      />
      <PartEditor
        label="Palette 2"
        parts={traits.logoPalettes}
        selectedIndex={logoPalette2}
        onSelect={handleSelect(56)}
      />
      <PartEditor
        label="Logo 1"
        parts={traits.logos1}
        selectedIndex={logo1}
        onSelect={handleSelect(64)}
      />
      <PartEditor
        label="Logo 2"
        parts={traits.logos2}
        selectedIndex={logo2}
        onSelect={handleSelect(72)}
      />
      <PartEditor
        label="Logo 3"
        parts={traits.logos3}
        selectedIndex={logo3}
        onSelect={handleSelect(80)}
      />
      <PartEditor
        label="Logo 4"
        parts={traits.logos4}
        selectedIndex={logo4}
        onSelect={handleSelect(88)}
      />
    </div>
  )
}
