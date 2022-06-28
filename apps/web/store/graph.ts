import { ModuleCondensed } from '@modtree/entity'
import { ModtreeApiResponse } from '@modtree/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Node } from 'react-flow-renderer'
import { baseInitialState } from './initial-state'

export const graph = createSlice({
  name: 'graph',
  initialState: baseInitialState.graph,
  reducers: {
    setGraph: (graph, action: PayloadAction<ModtreeApiResponse.Graph>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        graph[key] = value
      })
    },
    setGraphSelectedCodes: (
      graph,
      action: PayloadAction<Node<ModuleCondensed>[]>
    ) => {
      graph.selectedCodes = action.payload.map((node) => node.data.moduleCode)
    },
    addModuleNode: (graph, action: PayloadAction<Node<ModuleCondensed>>) => {
      const node = action.payload
      const currentCodes = graph.flowNodes.map((n) => n.data.moduleCode)
      if (!currentCodes.includes(node.data.moduleCode)) {
        graph.flowNodes = [...graph.flowNodes, node]
      }
    },
    updateModuleNode: (graph, action: PayloadAction<Node<ModuleCondensed>>) => {
      const node = action.payload
      const index = graph.flowNodes.findIndex(
        (x) => x.data.moduleCode === node.data.moduleCode
      )
      graph.flowNodes[index] = node
    },
  },
})

export const {
  setGraphSelectedCodes,
  addModuleNode,
  updateModuleNode,
  setGraph,
} = graph.actions
export default graph.reducer
