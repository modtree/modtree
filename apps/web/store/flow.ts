import { createSlice } from '@reduxjs/toolkit'

export const treeSelectionSlice = createSlice({
  name: 'flow-selection',
  initialState: { moduleCode: [] },
  reducers: {
    setFlowSelection: (state, action) => {
      state.moduleCode = action.payload
    },
  },
})

export type FlowState = {
  flow: {
    moduleCode: string
  }
}

export const { setFlowSelection } = treeSelectionSlice.actions
export default treeSelectionSlice.reducer
