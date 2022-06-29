import { Combobox } from '@headlessui/react'
import { UseState } from '@modtree/types'
import { AnyAction, Dispatch } from 'redux'
import { SearchInput } from './input'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import { FC } from 'react'
import { Modtree } from 'types'

export function SearchContainer(props: {
  selectState: UseState<Modtree.ModuleCondensed>
  dispatch: Dispatch
  onSelect: (_: string) => void
  clear: () => AnyAction
  set: ActionCreatorWithOptionalPayload<Modtree.ModuleCondensed[], string>
  resultsComponent: FC<{ selectState: UseState<Modtree.ModuleCondensed> }>
  inputClass?: string
  inputContainerClass?: string
  hideResults?: boolean
  searchIcon?: boolean
}) {
  const [selected] = props.selectState
  return (
    <Combobox value={selected.moduleCode} onChange={props.onSelect}>
      <SearchInput
        dispatch={props.dispatch}
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
