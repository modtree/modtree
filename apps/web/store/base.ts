import { backend } from '@/utils'
import { FlowNodeCondensed, ModtreeApiResponse } from '@modtree/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Node } from 'react-flow-renderer'
import { ModuleNodeProps } from '@modtree/types'

import { baseInitialState } from './initial-state'

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
    toggleModuleNode: (state, action: PayloadAction<Node<ModuleNodeProps>>) => {
      const node = action.payload
      const currentNodes = state.graph.flowNodes
      const currentCodes = currentNodes.map((n) => n.id)
      if (currentCodes.includes(node.id)) {
        state.graph.flowNodes = currentNodes.filter((n) => n.id !== node.id)
      } else {
        state.graph.flowNodes.push(node)
      }
    },
    addModuleNode: (state, action: PayloadAction<Node<ModuleNodeProps>>) => {
      const node = action.payload
      const currentNodes = state.graph.flowNodes
      const currentCodes = currentNodes.map((n) => n.id)
      console.log(
        'positions',
        state.graph.flowNodes.map((x) => x.position)
      )
      if (!currentCodes.includes(node.id)) {
        const arr = [...currentNodes, node]
        console.log(arr)
        state.graph.flowNodes = arr
      }
    },
    updateModuleNode: (state, action: PayloadAction<Node<ModuleNodeProps>>) => {
      const node = action.payload
      const index = state.graph.flowNodes.findIndex((x) => x.id === node.id)
      state.graph.flowNodes[index] = node
    },
  },
})

export const {
  setBaseUser,
  setBaseDegree,
  setBaseGraph,
  setModulesCondensed,
  toggleModuleNode,
  addModuleNode,
  updateModuleNode,
} = base.actions

export default base.reducer
