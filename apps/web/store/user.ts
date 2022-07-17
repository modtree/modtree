import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'
import { ModtreeApiResponse } from '@modtree/types'

export const user = createSlice({
  name: 'user',
  initialState: baseInitialState.user,
  reducers: {
    updateModulesDone: (user, action: PayloadAction<string[]>) => {
      user.modulesDone = action.payload
    },
    updateModulesDoing: (user, action: PayloadAction<string[]>) => {
      user.modulesDoing = action.payload
    },
    setUser: (user, action: PayloadAction<ModtreeApiResponse.User>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        ;(user as any)[key] = value
      })
    },
  },
})

export const { updateModulesDone, updateModulesDoing, setUser } = user.actions
export default user.reducer
