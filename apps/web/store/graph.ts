import { getPosition } from '@/flow/dagre'
import { IModule, IGraph, GraphFlowNode } from '@modtree/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Node } from 'react-flow-renderer'
import { baseInitialState } from './initial-state'

export const graph = createSlice({
  name: 'graph',
  initialState: baseInitialState.graph,
  reducers: {
    setGraph: (graph, action: PayloadAction<IGraph>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        graph[key] = value
      })
    },
    setGraphSelectedCodes: (graph, action: PayloadAction<GraphFlowNode[]>) => {
      graph.selectedCodes = action.payload.map((node) => node.data.moduleCode)
    },
    addModuleNode: (graph, action: PayloadAction<Node<IModule>>) => {
      const node = action.payload
      /**
       * if the code is already in, do nothing.
       */
      const currentCodes = graph.flowNodes.map((n) => n.data.moduleCode)
      if (currentCodes.includes(node.data.moduleCode)) return

      /**
       * otherwise, operate on the graph.
       */
      const nodes = [...graph.flowNodes, node]
      // TODO: add edges
      const newPositions = getPosition(nodes, graph.flowEdges)
      graph.flowNodes = newPositions
    },
    removeModuleNode: (graph, action: PayloadAction<GraphFlowNode>) => {
      const rmNode = action.payload
      if (!rmNode) return
      console.log(rmNode)
      // const nodes = graph.flowNodes.filter(
      //   (node) => node.data.moduleCode !== rmNode.data.moduleCode
      // )
      // // TODO: remove edges
      // const newPositions = getPosition(nodes, graph.flowEdges)
      // graph.flowNodes = newPositions
    },
    updateModuleNode: (graph, action: PayloadAction<Node<IModule>>) => {
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
  removeModuleNode,
  setGraph,
} = graph.actions
export default graph.reducer
