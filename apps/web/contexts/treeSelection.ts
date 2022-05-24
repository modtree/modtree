import { createSlice } from '@reduxjs/toolkit'

export const treeSelectionSlice = createSlice({
  name: 'tree-selection',
  initialState: { moduleCode: [] },
  reducers: {
    setTreeSelection: (state, action) => {
      state.moduleCode = action.payload
    },
  },
})

export const { setTreeSelection } = treeSelectionSlice.actions
export default treeSelectionSlice.reducer
