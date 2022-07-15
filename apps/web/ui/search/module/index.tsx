import { useState } from 'react'
import { useAppDispatch } from '@/store/redux'
import { flatten } from '@/utils/tailwind'
import { setModalModule, showModuleModal } from '@/store/modal'
import { trpc } from '@/utils/trpc'
import { api } from 'api'
import { SearchContainer } from './container'
import { SearchResultContainer } from './results'

export function RootSearchBox() {
  /**
   * only changes upon clicking on the search result
   */
  const [selected, setSelected] = useState('')
  const dispatch = useAppDispatch()

  const onSelect = (query: string) => {
    if (!query) return
    setSelected(query)
    dispatch(showModuleModal())
    trpc
      .query('module-full', query)
      .then((module) => dispatch(setModalModule(module)))
  }

  return (
    <div className="fixed top-3 left-3 w-72 z-10">
      <SearchContainer
        selected={selected}
        onSelect={onSelect}
        inputContainerClass="h-10"
        searchIcon
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
    api.degree.addToBuildList(moduleCode)
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
