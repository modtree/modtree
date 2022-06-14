import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type State = {
  selection: string[]
}

export type FlowState = {
  flow: State
}

const initialState: State = {
  selection: [],
}

export const flow = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    setFlowSelection: (state, action: PayloadAction<string[]>) => {
      state.selection = action.payload
    },
  },
})

export const { setFlowSelection } = flow.actions
export default flow.reducer
