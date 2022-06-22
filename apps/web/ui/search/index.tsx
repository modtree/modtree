import { useState } from 'react'
import { useAppDispatch } from '@/store/redux'
import { getModuleInfo } from './lib'
import { clearSearches, setSearchedModuleCondensed } from '@/store/search'
import { SearchContainer } from './container'
import { SearchResultContainer } from './results'
import { flatten } from '@/utils/tailwind'
import { ModuleCondensed } from '@modtree/entity'

const emptyModuleCondensed: ModuleCondensed = {
  title: '',
  id: '',
  moduleCode: '',
  moduleLevel: 0,
}

export function RootSearchBox() {
  const dispatch = useAppDispatch()
  /**
   * only changes upon clicking on the search result
   */
  const selectState = useState(emptyModuleCondensed)

  const onSelect = (query: ModuleCondensed) => {
    selectState[1](query)
    getModuleInfo(dispatch, query.moduleCode)
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
  const selectState = useState(emptyModuleCondensed)

  const onSelect = (query: ModuleCondensed) => {
    selectState[1](query)
    console.log(query)
  }

  return (
    <div
      className={flatten(
        // 'border border-red-500',
        'ui-rectangle',
        'overflow-hidden',
        'shadow-none',
        'h-8'
      )}
    >
      <SearchContainer
        resultsComponent={SearchResultContainer}
        set={setSearchedModuleCondensed}
        clear={clearSearches}
        selectState={selectState}
        onSelect={onSelect}
        dispatch={dispatch}
        inputContainerClass="h-8 shadow-none"
        inputClass="h-8 shadow-none"
      />
    </div>
  )
}
