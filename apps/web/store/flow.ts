import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Edge, Node } from 'react-flow-renderer'
import { FlowNodeCondensed, FlowEdgeCondensed } from 'types'

type State = {
  selection: string[]
  nodes: FlowNodeCondensed[]
  edges: FlowEdgeCondensed[]
}

export type FlowState = {
  flow: State
}

const initialState: State = {
  selection: [],
  nodes: [],
  edges: [],
}

export const flow = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    setFlowSelection: (state, action: PayloadAction<string[]>) => {
      state.selection = action.payload
    },
    setFlowNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload.map((node) => ({
        moduleCode: node.id,
        position: node.position,
      }))
    },
    setFlowEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      }))
    },
  },
})

export const { setFlowSelection, setFlowNodes, setFlowEdges } = flow.actions
export default flow.reducer
