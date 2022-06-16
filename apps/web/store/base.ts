import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ModtreeApiResponse } from '@modtree/types'
import { EmptyResponse } from '@modtree/utils'
import axios from 'axios'
import { Dispatch, AnyAction } from 'redux'

export type ModuleCondensedMap = {
  [key: string]: ModtreeApiResponse.ModuleCondensed
}

type State = {
  user: ModtreeApiResponse.User
  degree: ModtreeApiResponse.Degree
  graph: ModtreeApiResponse.Graph
  modulesCondensed: ModuleCondensedMap
}

export type UserState = {
  base: State
}

const initialState: State = {
  user: EmptyResponse.User,
  degree: EmptyResponse.Degree,
  graph: EmptyResponse.Graph,
  modulesCondensed: {},
}

export const getModulesCondensed = async (
  dispatch: Dispatch<AnyAction>,
  moduleCodes: string[]
) => {
  const backend = process.env.NEXT_PUBLIC_BACKEND
  axios
    .post(`${backend}/modules/find-by-codes`, {
      moduleCodes,
    })
    .then((res) => {
      // replace entirely for now
      let modulesMap = {}
      res.data.forEach((one: ModtreeApiResponse.ModuleCondensed) => {
        modulesMap[one.moduleCode] = one
      })
      dispatch(setModulesCondensed(modulesMap))
    })
    .catch(() => console.log('Database error'))
}

export const base = createSlice({
  name: 'base',
  initialState,
  reducers: {
    setBaseUser: (state, action: PayloadAction<ModtreeApiResponse.User>) => {
      state.user = action.payload
    },
    setBaseDegree: (
      state,
      action: PayloadAction<ModtreeApiResponse.Degree>
    ) => {
      state.degree = action.payload
    },
    setBaseGraph: (state, action: PayloadAction<ModtreeApiResponse.Graph>) => {
      state.graph = action.payload
    },
    setModulesCondensed: (state, action: PayloadAction<ModuleCondensedMap>) => {
      console.log(action.payload)
      state.modulesCondensed = action.payload
    },
  },
})

export const { setBaseUser, setBaseDegree, setBaseGraph, setModulesCondensed } =
  base.actions
export default base.reducer
