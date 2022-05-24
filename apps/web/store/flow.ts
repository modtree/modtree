import { createSlice } from '@reduxjs/toolkit'

export const flow = createSlice({
  name: 'flow',
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

export const { setFlowSelection } = flow.actions
export default flow.reducer
