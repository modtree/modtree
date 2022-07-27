import { useState } from 'react'
import { cc } from '@/utils/tailwind'
import { SearchContainer } from './container'
import { SearchResultContainer } from './results'
import { addModuleToBuildList, openModuleModal } from '@/store/functions'

export function RootSearchBox() {
  /**
   * only changes upon clicking on the search result
   */
  const [selected, setSelected] = useState('')

  const onSelect = (query: string) => {
    if (!query) return
    setSelected(query)
    openModuleModal(query)
  }

  return (
    <div className="fixed top-3 left-3 w-72 z-10">
      <SearchContainer
        selected={selected}
        onSelect={onSelect}
        inputContainerClass="h-10"
        searchIcon
        cypress="root-search-box"
      >
        <SearchResultContainer />
      </SearchContainer>
    </div>
  )
}

export function SettingsSearchBox(props: { cypress?: string }) {
  /**
   * only changes upon clicking on the search result
   */
  const [selected, setSelected] = useState('')

  const onSelect = (moduleCode: string) => {
    if (!moduleCode) return
    setSelected(moduleCode)
    addModuleToBuildList(moduleCode)
  }

  return (
    <div
      className={cc(
        // 'border border-red-500',
        'ui-rectangle',
        'shadow-none',
        'h-8 w-64'
      )}
    >
      <SearchContainer
        selected={selected}
        onSelect={onSelect}
        inputContainerClass="h-full shadow-none"
        inputClass="h-full shadow-none"
        cypress={props.cypress}
      >
        <SearchResultContainer />
      </SearchContainer>
    </div>
  )
}
