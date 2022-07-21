import { dagreify } from '@modtree/utils'
import { GraphFlowEdge, GraphFlowNode, ApiResponse } from '@modtree/types'
import { createSlice, PayloadAction as P } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'
import {
  applyNodeChanges as RFApplyNodeChanges,
  NodeChange,
} from 'react-flow-renderer'
import { trpc } from '@/utils/trpc'

function alreadyHas(node: GraphFlowNode, current: GraphFlowNode[]): boolean {
  const currentCodes = current.map((n) => n.data.moduleCode)
  return currentCodes.includes(node.data.moduleCode)
}

/**
 * updates nodes and edges in both frontend and backend
 */
function setFlow(state: any, nodes: GraphFlowNode[]) {
  const { flowNodes, flowEdges } = dagreify(nodes)
  state.graph.flowNodes = flowNodes
  state.graph.flowEdges = flowEdges
  trpc.mutation('graph/update-frontend-props', {
    graphId: state.graph.id,
    flowNodes,
    flowEdges,
  })
}

export const modtreeStore = createSlice({
  name: 'modtree',
  initialState: baseInitialState.modtree,
  reducers: {
    /** update user's modules done */
    updateModulesDone: (state, action: P<string[]>) => {
      state.user.modulesDone = action.payload
    },

    /** updates user's currently doing modules */
    updateModulesDoing: (state, action: P<string[]>) => {
      state.user.modulesDoing = action.payload
    },

    /** set user */
    setUser: (state, action: P<ApiResponse.User>) => {
      state.user = action.payload
    },

    /** set main degree on display */
    setMainDegree: (state, action: P<ApiResponse.Degree>) => {
      state.degree = action.payload
    },

    /**
     * Overwrite the entire graph.
     * Meant to be used for initial page loads.
     */
    setMainGraph: (state, action: P<ApiResponse.Graph>) => {
      state.graph = {
        ...action.payload,
        // TODO: find out the root cause of this empty flowNode
        // so we can remove this filter
        flowNodes: action.payload.flowNodes
          .filter((x) => JSON.stringify(x) !== '{}')
          .filter((x) => x.position !== undefined),
        selectedCodes: state.graph.selectedCodes,
      }
    },

    /** only used for dragging a node responsively */
    applyNodeChanges: (state, action: P<NodeChange[]>) => {
      state.graph.flowNodes = RFApplyNodeChanges(
        action.payload,
        state.graph.flowNodes
      )
    },

    /**
     * value-add above setNodes and setEdges is that it also calls dagreify
     * and updates persists the new state in database
     */
    setNodesAndEdges: (state, action: P<GraphFlowNode[]>) => {
      setFlow(state, action.payload)
    },

    /** sets nodes */
    setNodes: (state, action: P<GraphFlowNode[]>) => {
      state.graph.flowNodes = action.payload
    },

    /** sets edges */
    setEdges: (state, action: P<GraphFlowEdge[]>) => {
      state.graph.flowEdges = action.payload
    },

    /** user's selected nodes */
    setGraphSelectedCodes: (state, action: P<string[]>) => {
      state.graph.selectedCodes = action.payload
    },

    /**
     * add a module node to the graph, and re-positions the nodes
     */
    addModuleNode: (state, action: P<GraphFlowNode>) => {
      if (!action.payload) return
      const node = action.payload

      /** if the code is already in, do nothing. */
      if (alreadyHas(node, state.graph.flowNodes)) return

      /** add it to the graph */
      setFlow(state, [...state.graph.flowNodes, node])
    },

    /**
     * remove a module node from the graph
     */
    removeModuleNode: (state, action: P<GraphFlowNode>) => {
      if (!action.payload) return
      const node = action.payload
      const code = node.data.moduleCode

      /** add it to the graph */
      modtreeStore.caseReducers.setNodesAndEdges(state, {
        payload: state.graph.flowNodes.filter(
          (n) => n.data.moduleCode !== code
        ),
        type: '',
      })
    },
  },
})

export default {
  reducer: modtreeStore.reducer,
  actions: modtreeStore.actions,
}
