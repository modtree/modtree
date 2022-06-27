import { setModalModule, showModuleModal } from '@/store/modal'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import axios from 'axios'
import { AnyAction, Dispatch } from 'redux'

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
  return axios
    .get(`/api/search/modules-condensed/${upper}`)
    .then((res) => dispatch(set(res.data.slice(0, 10))))
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
  return axios
    .get(`/api/module/${value}`)
    .then((res) => dispatch(setModalModule(res.data)))
    .catch(() => false)
}
