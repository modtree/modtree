import { ModuleNodeProps } from '@modtree/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Node } from 'react-flow-renderer'
import { baseInitialState } from './initial-state'

export const graph = createSlice({
  name: 'graph',
  initialState: baseInitialState.graph,
  reducers: {
    setGraphSelectedCodes: (
      state,
      action: PayloadAction<Node<ModuleNodeProps>[]>
    ) => {
      state.selectedCodes = action.payload.map((node) => node.data.moduleCode)
    },
    addModuleNode: (state, action: PayloadAction<Node<ModuleNodeProps>>) => {
      const node = action.payload
      const currentCodes = state.flowNodes.map((n) => n.data.moduleCode)
      if (!currentCodes.includes(node.data.moduleCode)) {
        state.flowNodes = [...state.flowNodes, node]
      }
    },
    updateModuleNode: (state, action: PayloadAction<Node<ModuleNodeProps>>) => {
      const node = action.payload
      const index = state.flowNodes.findIndex(
        (x) => x.data.moduleCode === node.data.moduleCode
      )
      state.flowNodes[index] = node
    },
  },
})

export const { setGraphSelectedCodes, addModuleNode, updateModuleNode } =
  graph.actions
export default graph.reducer
