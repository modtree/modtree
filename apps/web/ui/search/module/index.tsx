import { useState } from 'react'
import { useAppDispatch } from '@/store/redux'
import { clearSearches, setSearchedModule } from '@/store/search'
import { SearchContainer } from './container'
import { SearchResultContainer } from './results'
import { flatten } from '@/utils/tailwind'
import { setModalModule, showModuleModal } from '@/store/modal'
import { trpc } from '@/utils/trpc'
import { api } from 'api'

export function RootSearchBox() {
  /**
   * only changes upon clicking on the search result
   */
  const selectState = useState('')
  const dispatch = useAppDispatch()

  const onSelect = (query: string) => {
    if (!query) return
    selectState[1](query)
    dispatch(showModuleModal())
    trpc
      .query('module-full', query)
      .then((module) => dispatch(setModalModule(module)))
  }

  return (
    <div className="fixed top-3 left-3 w-72 z-10">
      <SearchContainer
        resultsComponent={SearchResultContainer}
        set={setSearchedModule}
        clear={clearSearches}
        selectState={selectState}
        onSelect={onSelect}
        inputContainerClass="h-10"
        searchIcon
      />
    </div>
  )
}

export function SettingsSearchBox(props: { cypress?: string }) {
  /**
   * only changes upon clicking on the search result
   */
  const selectState = useState('')

  const onSelect = (moduleCode: string) => {
    selectState[1](moduleCode)
    api.degree.addToBuildList(moduleCode)
    selectState[1]('')
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
        inputContainerClass="h-full shadow-none"
        inputClass="h-full shadow-none"
        cypress={props.cypress}
      />
    </div>
  )
}
