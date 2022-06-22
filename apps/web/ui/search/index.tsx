import { useState } from 'react'
import { useAppDispatch } from '@/store/redux'
import { getModuleInfo } from './lib'
import { clearSearches, setSearchedModuleCondensed } from '@/store/search'
import { SearchContainer } from './container'
import { SearchResults } from './results/root'

export function RootSearchBox() {
  const dispatch = useAppDispatch()
  /**
   * only changes upon clicking on the search result
   */
  const selectState = useState('')

  const onSelect = (query: string) =>
    getModuleInfo(dispatch, query, selectState)
  const props = {
    selectState,
    dispatch,
    onSelect,
    clear: clearSearches,
    set: setSearchedModuleCondensed,
  }

  return (
    <div className="fixed top-3 left-3 w-72 z-10">
      <SearchContainer {...props} resultsComponent={SearchResults} />
    </div>
  )
}
