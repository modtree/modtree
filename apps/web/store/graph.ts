import { dagreify } from '@modtree/utils'
import { ApiResponse, GraphFlowEdge, GraphFlowNode } from '@modtree/types'
import { createSlice, PayloadAction as P } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'
import {
  applyNodeChanges as RFApplyNodeChanges,
  NodeChange,
} from 'react-flow-renderer'

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
      graph.user = g.user
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
      const { flowNodes, flowEdges } = dagreify(action.payload)
      graph.flowNodes = flowNodes
      graph.flowEdges = flowEdges
    },

    /** sets nodes */
    setNodes: (graph, action: P<GraphFlowNode[]>) => {
      graph.flowNodes = action.payload
    },

    /** sets edges */
    setEdges: (graph, action: P<GraphFlowEdge[]>) => {
      graph.flowEdges = action.payload
    },
  },
})
