import { Combobox } from '@headlessui/react'
import { SearchInput } from './input'
import { ReactElement } from 'react'

export function SearchContainer(props: {
  selected: string
  onSelect: (_: string) => void
  children: ReactElement
  inputClass?: string
  inputContainerClass?: string
  hideResults?: boolean
  searchIcon?: boolean
  cypress?: string
}) {
  return (
    <Combobox value={props.selected} onChange={props.onSelect}>
      <SearchInput
        inputClass={props.inputClass}
        inputContainerClass={props.inputContainerClass}
        searchIcon={props.searchIcon}
        cypress={props.cypress}
      />
      <div className="relative w-full">
        {!props.hideResults ? props.children : null}
      </div>
    </Combobox>
  )
}
