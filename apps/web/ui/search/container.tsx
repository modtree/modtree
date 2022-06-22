import { Combobox } from '@headlessui/react'
import { SetState, UseState } from '@modtree/types'
import { AnyAction, Dispatch } from 'redux'
import { SearchInput } from './input'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import { FC } from 'react'

export function SearchContainer<T>(props: {
  selectState: UseState<string>
  dispatch: Dispatch
  onSelect: (_: string) => void
  clear: () => AnyAction
  set: ActionCreatorWithOptionalPayload<T[], string>
  hideResults?: boolean
  resultsComponent: FC<{ setSelected: SetState<string> }>
}) {
  const [selected, setSelected] = props.selectState

  return (
    <Combobox value={selected} onChange={props.onSelect}>
      <SearchInput
        dispatch={props.dispatch}
        clear={props.clear}
        set={props.set}
      />
      {!props.hideResults && (
        <props.resultsComponent setSelected={setSelected} />
      )}
    </Combobox>
  )
}
