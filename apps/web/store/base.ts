import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ModtreeApiResponse } from '@modtree/types'
import { EmptyResponse } from '@modtree/utils'
import axios from 'axios'

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

const backend = process.env.NEXT_PUBLIC_BACKEND

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
    setModulesCondensed: (state, action: PayloadAction<string[]>) => {
      axios
        .post(`${backend}/modules/find-by-codes`, {
          moduleCodes: action.payload,
        })
        .then((res) => {
          // replace entirely for now
          state.modulesCondensed = {}
          res.data.forEach((module: ModtreeApiResponse.ModuleCondensed) => {
            state.modulesCondensed[module.moduleCode] = module
          })
        })
        .catch(() => console.log('Database error'))
    },
  },
})

export const { setBaseUser, setBaseDegree, setBaseGraph, setModulesCondensed } =
  base.actions
export default base.reducer
