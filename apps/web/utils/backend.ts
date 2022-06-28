import { setModalModule, showModuleModal } from '@/store/modal'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import { AnyAction, Dispatch } from 'redux'
import axios from 'axios'
import { addModulesCondensed } from '@/store/cache'
import { ModtreeApiResponse } from '@modtree/types'

export const backend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND,
})

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
  return backend
    .get(`/search/modules-condensed/${upper}`)
    .then((res) => dispatch(set(res.data)))
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
  return backend
    .get(`/module/${value}`)
    .then((res) => dispatch(setModalModule(res.data)))
    .catch(() => false)
}

export async function updateCachedModulesCondensed(
  dispatch: Dispatch<AnyAction>,
  moduleCodes: string[]
) {
  return backend
    .get<ModtreeApiResponse.ModuleCondensed[]>('/modules-condensed', {
      params: {
        moduleCodes,
      },
    })
    .then((res) => dispatch(addModulesCondensed(res.data)))
    .catch(() => false)
}
