import { redrawGraph } from '@/utils/flow'
import { IGraph, GraphFlowNode } from '@modtree/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'

function alreadyHas(
  newNode: GraphFlowNode,
  currentNodes: GraphFlowNode[]
): boolean {
  const currentCodes = currentNodes.map((n) => n.data.moduleCode)
  return currentCodes.includes(newNode.data.moduleCode)
}

export const graph = createSlice({
  name: 'graph',
  initialState: baseInitialState.graph,
  reducers: {
    /**
     * Overwrite the entire graph.
     * Meant to be used for initial page loads.
     */
    setGraph: (graph, action: PayloadAction<IGraph>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        graph[key] = value
      })
    },

    /**
     * User's selected nodes
     */
    setGraphSelectedCodes: (graph, action: PayloadAction<GraphFlowNode[]>) => {
      graph.selectedCodes = action.payload.map((node) => node.data.moduleCode)
    },

    /**
     * add a module node to the graph
     */
    addModuleNode: (graph, action: PayloadAction<GraphFlowNode>) => {
      if (!action.payload) return
      const node = action.payload
      /**
       * if the code is already in, do nothing.
       */
      if (alreadyHas(node, graph.flowNodes)) return
      /**
       * obtain the new nodes and edges
       */
      const { nodes, edges } = redrawGraph({
        nodes: [...graph.flowNodes, node],
        edges: graph.flowEdges,
      })
      /** update the graph */
      graph.flowNodes = nodes
      graph.flowEdges = edges
    },

    /**
     * remove a module node from the graph
     */
    removeModuleNode: (graph, action: PayloadAction<GraphFlowNode>) => {
      if (!action.payload) return
      const node = action.payload
      const code = node.data.moduleCode
      /**
       * remove the node and associated edges
       */
      const { nodes, edges } = redrawGraph({
        nodes: graph.flowNodes.filter((n) => n.data.moduleCode !== code),
        edges: graph.flowEdges.filter(
          (e) => e.source !== code && e.target !== code
        ),
      })
      /** update the graph */
      graph.flowNodes = nodes
      graph.flowEdges = edges
    },

    /**
     * Update one module node on the graph.
     * Meant for state updates (doing/doing/etc.)
     */
    updateModuleNode: (graph, action: PayloadAction<GraphFlowNode>) => {
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
