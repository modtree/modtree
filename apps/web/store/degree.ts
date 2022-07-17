import { ModtreeApiResponse } from '@modtree/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'

export const degree = createSlice({
  name: 'degree',
  initialState: baseInitialState.degree,
  reducers: {
    setDegree: (degree, action: PayloadAction<ModtreeApiResponse.Degree>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        ;(degree as any)[key] = value
      })
    },
  },
})

export const { setDegree } = degree.actions
export default degree.reducer
