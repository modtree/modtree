import { useState } from 'react'
import { useAppDispatch } from '@/store/redux'
import {
  addToBuildList,
  clearSearches,
  setSearchedModule,
} from '@/store/search'
import { SearchContainer } from './container'
import { SearchResultContainer } from './results'
import { flatten } from '@/utils/tailwind'
import { Module } from '@modtree/entity'
import { getModuleInfo } from '@/utils/backend'
import { EmptyResponse } from '@modtree/utils'

const emptyModule: Module = EmptyResponse.Module

export function RootSearchBox() {
  const dispatch = useAppDispatch()
  /**
   * only changes upon clicking on the search result
   */
  const selectState = useState(emptyModule)

  const onSelect = (query: Module) => {
    selectState[1](query)
    getModuleInfo(dispatch, query.moduleCode)
  }

  return (
    <div className="fixed top-3 left-3 w-72 z-10">
      <SearchContainer
        resultsComponent={SearchResultContainer}
        set={setSearchedModule}
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
  const selectState = useState(emptyModule)

  const onSelect = (query: Module) => {
    selectState[1](query)
    dispatch(addToBuildList(query))
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
        set={setSearchedModule}
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
