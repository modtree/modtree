import { ModtreeApiResponse } from '@modtree/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'

export const base = createSlice({
  name: 'base',
  initialState: baseInitialState.base,
  reducers: {
    setBaseUser: (state, action: PayloadAction<ModtreeApiResponse.User>) => {
      state.user = action.payload
    },
    setBaseDegree: (
      state,
      action: PayloadAction<ModtreeApiResponse.Degree>
    ) => {
      state.degree = action.payload
    },
  },
})

export const { setBaseUser, setBaseDegree } = base.actions

export default base.reducer
