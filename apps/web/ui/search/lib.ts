import { Dispatch, AnyAction } from 'redux'
import { ModuleCondensed } from '@modtree/entity'
import { clearSearches, setSearchedModuleCondensed } from '@/store/search'
import { UseState } from '@modtree/types'
import { setModalModule, showModuleModal } from '@/store/modal'

/**
 * searches module condensed
 */
export async function handleSearch(
  dispatch: Dispatch<AnyAction>,
  value: string
) {
  if (value.length === 0) {
    dispatch(clearSearches())
    return
  }
  const upper = value.toUpperCase()
  const backend = process.env.NEXT_PUBLIC_BACKEND
  const url = `${backend}/modules-condensed/search/${upper}`
  fetch(url)
    .then((res) => {
      res.json().then((result) => {
        const moduleList: ModuleCondensed[] = result
        dispatch(setSearchedModuleCondensed(moduleList.slice(0, 10)))
      })
    })
    .catch(() => true)
}

/**
 * get one full module info
 */
export async function getModuleInfo(
  dispatch: Dispatch<AnyAction>,
  value: string
) {
  if (!value) return
  dispatch(showModuleModal())
  const backend = process.env.NEXT_PUBLIC_BACKEND
  const url = `${backend}/modules/${value}`
  fetch(url)
    .then((res) => {
      res.json().then((result) => {
        dispatch(setModalModule(result))
      })
    })
    .catch(() => true)
}
