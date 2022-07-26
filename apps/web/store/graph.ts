import { dagreify } from '@modtree/utils'
import { ApiResponse, GraphFlowEdge, GraphFlowNode } from '@modtree/types'
import { createSlice, PayloadAction as P } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'
import {
  applyNodeChanges as RFApplyNodeChanges,
  NodeChange,
} from 'react-flow-renderer'
import { trpc } from '@/utils/trpc'
import { ReduxState } from './types'

/**
 * updates nodes and edges in both frontend and backend
 */
function setFlow(graph: ReduxState['graph'], nodes: GraphFlowNode[]) {
  const { flowNodes, flowEdges } = dagreify(nodes)
  graph.flowNodes = flowNodes
  graph.flowEdges = flowEdges
  trpc.mutation('graph/update-frontend-props', {
    graphId: graph.id,
    flowNodes,
    flowEdges,
  })
}

export default createSlice({
  name: 'graph',
  initialState: baseInitialState.graph,
  reducers: {
    /** only used for dragging a node responsively */
    applyNodeChanges: (graph, action: P<NodeChange[]>) => {
      graph.flowNodes = RFApplyNodeChanges(action.payload, graph.flowNodes)
    },

    /** sets entire graph */
    setMainGraph: (graph, action: P<ApiResponse.Graph>) => {
      const g = action.payload
      graph.id = g.id
      graph.title = g.title
      graph.degree = g.degree
      graph.flowNodes = g.flowNodes
      graph.flowEdges = g.flowEdges
    },

    /**
     * value-add above setNodes and setEdges is that it also calls dagreify
     * and updates persists the new state in database
     */
    setNodesAndEdges: (graph, action: P<GraphFlowNode[]>) => {
      setFlow(graph, action.payload)
    },

    /** sets nodes */
    setNodes: (graph, action: P<GraphFlowNode[]>) => {
      graph.flowNodes = action.payload
    },

    /** sets edges */
    setEdges: (graph, action: P<GraphFlowEdge[]>) => {
      graph.flowEdges = action.payload
    },

    /**
     * remove a module node from the graph
     */
    removeModuleNode: (graph, action: P<GraphFlowNode>) => {
      if (!action.payload) return
      const newNodes = graph.flowNodes.filter((n) => n.id !== action.payload.id)

      /** add it to the graph */
      setFlow(graph, newNodes)
    },
  },
})
