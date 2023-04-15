import { FC, Fragment, useCallback, useMemo } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"

type DropdownItem = {
  value: string
  label: string
}

type DropdownProps = {
  items: DropdownItem[]
  value?: string
  onSelect: (value: string) => void
}

export const Dropdown: FC<DropdownProps> = ({ items, value, onSelect }) => {
  const selectedItem = useMemo(() => items.find((item) => item.value === value), [items, value])

  const handleChange = useCallback(
    (item: DropdownItem) => {
      onSelect(item?.value)
    },
    [onSelect]
  )

  return (
    <Listbox value={selectedItem} onChange={handleChange}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-neutral-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">{selectedItem?.label ?? "--- select ---"}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-neutral-950 ring-opacity-5 focus:outline-none sm:text-sm">
            {items.map((item, idx) => (
              <Listbox.Option
                key={idx}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? "bg-neutral-700" : "text-neutral-500"
                  }`
                }
                value={item}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                      {item.label}
                    </span>
                    {selected ? (
                      <span className="text-polkadot absolute inset-y-0 left-0 flex items-center pl-3">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
