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
  },
})

export const { setGraphSelectedCodes } = graph.actions
export default graph.reducer
