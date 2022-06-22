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
export async function handleSearch<T>(props: {
  dispatch: Dispatch
  clear: () => AnyAction
  set: ActionCreatorWithOptionalPayload<T[], string>
  value: string
}) {
  const { dispatch, value, clear, set } = props
  if (value.length === 0) {
    dispatch(clear())
    return
  }
  const upper = value.toUpperCase()
  const backend = process.env.NEXT_PUBLIC_BACKEND
  const url = `${backend}/modules-condensed/search/${upper}`
  fetch(url)
    .then((res) => {
      res.json().then((result) => {
        const moduleList: T[] = result
        dispatch(set(moduleList.slice(0, 10)))
      })
    })
    .catch(() => true)
}
