import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FlowNodeCondensed, ModtreeApiResponse } from '@modtree/types'
import { baseInitialState } from './initial-state'
import { backend } from '@/utils'

export const base = createSlice({
  name: 'base',
  initialState: baseInitialState.base,
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
      backend
        .post('/modules/find-by-codes', {
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
  },
})

export const {
  setBaseUser,
  setBaseDegree,
  setBaseGraph,
  setModulesCondensed,
  toggleGraphModule,
} = base.actions

export default base.reducer
