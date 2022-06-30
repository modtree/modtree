import { Combobox } from '@headlessui/react'
import { IModule, UseState } from '@modtree/types'
import { AnyAction } from 'redux'
import { SearchInput } from './input'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import { FC } from 'react'

export function SearchContainer(props: {
  selectState: UseState<string>
  onSelect: (_: string) => void
  clear: () => AnyAction
  set: ActionCreatorWithOptionalPayload<IModule[], string>
  resultsComponent: FC<{ selectState: UseState<string> }>
  inputClass?: string
  inputContainerClass?: string
  hideResults?: boolean
  searchIcon?: boolean
}) {
  const [selected] = props.selectState
  return (
    <Combobox value={selected} onChange={props.onSelect}>
      <SearchInput
        clear={props.clear}
        set={props.set}
        inputClass={props.inputClass}
        inputContainerClass={props.inputContainerClass}
        searchIcon={props.searchIcon}
      />
      <div className="relative w-full">
        {!props.hideResults && (
          <props.resultsComponent selectState={props.selectState} />
        )}
      </div>
    </Combobox>
  )
}
