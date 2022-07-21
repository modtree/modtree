import { ApiResponse } from '@modtree/types'
import { createSlice, PayloadAction as P } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'

export default createSlice({
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
  },
})
