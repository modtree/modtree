import { useState } from 'react'
import { useAppDispatch } from '@/store/redux'
import {
  addToBuildList,
  clearSearches,
  setSearchedModuleCondensed,
} from '@/store/search'
import { SearchContainer } from './container'
import { SearchResultContainer } from './results'
import { flatten } from '@/utils/tailwind'
import { api } from 'api'

export function RootSearchBox() {
  const dispatch = useAppDispatch()
  /**
   * only changes upon clicking on the search result
   */
  const selectState = useState('')

  const onSelect = (query: string) => {
    if (!query) return
    selectState[1](query)
    console.log('query', query)
    api.module.openModuleModal(query)
  }

  return (
    <div className="fixed top-3 left-3 w-72 z-10">
      <SearchContainer
        resultsComponent={SearchResultContainer}
        set={setSearchedModuleCondensed}
        clear={clearSearches}
        selectState={selectState}
        onSelect={onSelect}
        dispatch={dispatch}
        inputContainerClass="h-10"
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
    api.moduleCondensed
      .getByCodes([query])
      .then((res) => dispatch(addToBuildList(res[0])))
  }

  return (
    <div
      className={flatten(
        // 'border border-red-500',
        'ui-rectangle',
        'shadow-none',
        'h-8 w-64'
      )}
    >
      <SearchContainer
        resultsComponent={SearchResultContainer}
        set={setSearchedModuleCondensed}
        clear={clearSearches}
        selectState={selectState}
        onSelect={onSelect}
        dispatch={dispatch}
        inputContainerClass="h-full shadow-none"
        inputClass="h-full shadow-none"
      />
    </div>
  )
}
