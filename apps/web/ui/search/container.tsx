import { Combobox } from '@headlessui/react'
import { SetState, UseState } from '@modtree/types'
import { AnyAction, Dispatch } from 'redux'
import { SearchInput } from './input'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import { FC } from 'react'

export function SearchContainer<T>(props: {
  selectState: UseState<T>
  dispatch: Dispatch
  onSelect: (_: T) => void
  clear: () => AnyAction
  set: ActionCreatorWithOptionalPayload<T[], string>
  resultsComponent: FC<{ setSelected: SetState<T> }>
  inputClass?: string
  inputContainerClass?: string
  hideResults?: boolean
  searchIcon?: boolean
}) {
  const [selected, setSelected] = props.selectState
  return (
    <Combobox value={selected} onChange={props.onSelect}>
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
          <props.resultsComponent setSelected={setSelected} />
        )}
      </div>
    </Combobox>
  )
}
