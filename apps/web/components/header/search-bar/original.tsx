import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearSearches,
  SearchState,
  setSearchedModuleCondensed,
} from '@/store/search'
import { Input } from '@/components/Html'
import { ModuleCondensed } from '@modtree/entity'
import { flatten } from '@/utils/tailwind'
import { AnyAction, Dispatch } from 'redux'
import { UseState } from 'types'
import { Prompt, SearchButton, Base } from './components'

/**
 * talk to backend
 */
async function handleQuery(
  dispatch: Dispatch<AnyAction>,
  value: string,
  reload: UseState<boolean>
) {
  if (value.length === 0) {
    dispatch(clearSearches())
    return
  }
  const upper = value.toUpperCase()
  const backend = process.env.NEXT_PUBLIC_BACKEND
  const url = `${backend}/modules/find/${upper}`
  fetch(url)
    .then((res) => {
      res.json().then((result) => {
        const moduleList: ModuleCondensed[] = result
        dispatch(setSearchedModuleCondensed(moduleList))
        reload[1](!reload[0])
      })
    })
    .catch(() => true)
}

export default function SearchBar() {
  const dispatch = useDispatch()
  const displayState = useState('')
  const hasResults = useSelector<SearchState, boolean>(
    (state) => state.search.hasResults
  )

  const bg = 'bg-white'
  const [focused, setFocused] = useState(false)
  const reload = useState(false)

  useEffect(() => {
    if (displayState[0].length === 0) {
      dispatch(clearSearches())
      return
    }
  }, [reload[0]])

  function onFocus() {
    setFocused(true)
    handleQuery(dispatch, displayState[0], reload)
  }

  function onBlur() {
    setFocused(false)
    // dispatch(clearSearches())
  }

  return (
    <Base focused={focused} bg={bg} hasResults={hasResults}>
      <Prompt />
      <Input
        onFocus={onFocus}
        onBlur={onBlur}
        displayState={displayState}
        className={flatten('flex-1 text-sm h-12', bg)}
        callback={(e) => handleQuery(dispatch, e, reload)}
      />
      <SearchButton />
    </Base>
  )
}
