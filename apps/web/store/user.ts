import { Module } from '@modtree/entity'
import { ModtreeApiResponse } from '@modtree/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'

export const user = createSlice({
  name: 'user',
  initialState: baseInitialState.user,
  reducers: {
    updateModulesDone: (user, action: PayloadAction<Module[]>) => {
      user.modulesDone = action.payload
    },
    updateModulesDoing: (user, action: PayloadAction<Module[]>) => {
      user.modulesDoing = action.payload
    },
    setUser: (user, action: PayloadAction<ModtreeApiResponse.User>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        user[key] = value
      })
    },
  },
})

export const { updateModulesDone, updateModulesDoing, setUser } = user.actions
export default user.reducer
