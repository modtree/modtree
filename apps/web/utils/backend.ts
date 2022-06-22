import { ModuleCondensed } from '@modtree/entity'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import axios from 'axios'
import { AnyAction, Dispatch } from 'redux'

export const backend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND,
})

export async function fetcher(url: string) {
  return axios.get(url).then((res) => res.data)
}

/**
 * searches module condensed
 */
export async function handleSearch(props: {
  dispatch: Dispatch
  clear: () => AnyAction
  set: ActionCreatorWithOptionalPayload<ModuleCondensed[], string>
  value: string
}) {
  const { dispatch, value, clear, set } = props
  if (value.length === 0) {
    dispatch(clear())
    return
  }
  const upper = value.toUpperCase()
  const backend = process.env.NEXT_PUBLIC_BACKEND
  const url = `${backend}/modules-condensed/${upper}/search`
  fetch(url)
    .then((res) => {
      res.json().then((result) => {
        const moduleList: ModuleCondensed[] = result
        dispatch(set(moduleList.slice(0, 10)))
      })
    })
    .catch(() => true)
}
