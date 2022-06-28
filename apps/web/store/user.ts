import { ModtreeApiResponse } from '@modtree/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'

export const user = createSlice({
  name: 'user',
  initialState: baseInitialState.user,
  reducers: {
    updateModulesDone: (user, action: PayloadAction<string[]>) => {
      const set = new Set(action.payload)
      user.modulesDone = Array.from(set)
    },
    setUser: (user, action: PayloadAction<ModtreeApiResponse.User>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        user[key] = value
      })
    },
  },
})

export const { updateModulesDone, setUser } = user.actions
export default user.reducer
