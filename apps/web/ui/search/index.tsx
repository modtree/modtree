import { useState } from 'react'
import { useAppDispatch } from '@/store/redux'
import { getModuleInfo } from './lib'
import { clearSearches, setSearchedModuleCondensed } from '@/store/search'
import { SearchContainer } from './container'
import { RootSearchResults, SettingsSearchResults } from './results'
import { flatten } from '@/utils/tailwind'

export function RootSearchBox() {
  const dispatch = useAppDispatch()
  /**
   * only changes upon clicking on the search result
   */
  const selectState = useState('')

  const onSelect = (query: string) => {
    selectState[1](query)
    getModuleInfo(dispatch, query)
  }

  return (
    <div className="fixed top-3 left-3 w-72 z-10">
      <SearchContainer
        resultsComponent={RootSearchResults}
        set={setSearchedModuleCondensed}
        clear={clearSearches}
        selectState={selectState}
        onSelect={onSelect}
        dispatch={dispatch}
        searchIcon
      />
    </div>
  )
}

export function SettingsSearchBox() {
  const dispatch = useAppDispatch()
  /**
   * only changes upon clicking on the search result
   */
  const selectState = useState('')

  const onSelect = (query: string) => {
    selectState[1](query)
    getModuleInfo(dispatch, query)
  }

  return (
    <div
      className={flatten(
        // 'border border-red-500',
        'ui-rectangle',
        'shadow-none',
        'h-8',
        'z-10 w-64',
        'overflow-hidden'
      )}
    >
      <SearchContainer
        resultsComponent={SettingsSearchResults}
        set={setSearchedModuleCondensed}
        clear={clearSearches}
        selectState={selectState}
        onSelect={onSelect}
        dispatch={dispatch}
        inputContainerClass="h-8"
        inputClass="h-8"
      />
    </div>
  )
}
