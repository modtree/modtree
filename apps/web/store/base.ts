import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from '@reduxjs/toolkit'
import { FlowNodeCondensed, ModtreeApiResponse } from '@modtree/types'
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

const reducers: ValidateSliceCaseReducers<State, SliceCaseReducers<State>> = {
  setBaseUser: (state, action: PayloadAction<ModtreeApiResponse.User>) => {
    state.user = action.payload
  },
  setBaseDegree: (state, action: PayloadAction<ModtreeApiResponse.Degree>) => {
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
  toggleGraphModule: (state, action: PayloadAction<FlowNodeCondensed>) => {
    const node = action.payload
    const currentNodes = state.graph.flowNodes
    const currentCodes = currentNodes.map((n) => n.moduleCode)
    if (currentCodes.includes(node.moduleCode)) {
      state.graph.flowNodes = currentNodes.filter(
        (n) => n.moduleCode !== node.moduleCode
      )
    } else {
      state.graph.flowNodes.push(node)
    }
  },
}

export const base = createSlice({
  name: 'base',
  initialState,
  reducers,
})

export const {
  setBaseUser,
  setBaseDegree,
  setBaseGraph,
  setModulesCondensed,
  toggleGraphModule,
} = base.actions

export default base.reducer
