import { ModtreeApiResponse } from '@modtree/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'

export const user = createSlice({
  name: 'user',
  initialState: baseInitialState.user,
  reducers: {
    updateModulesDone: (_user, action: PayloadAction<string[]>) => {
      console.log('redux user, update mods done:', action.payload)
    },
    setUser: (user, action: PayloadAction<ModtreeApiResponse.User>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        user[key] = value
      })
      user.modulesDoing = ['CS1010']
    },
  },
})

export const { updateModulesDone, setUser } = user.actions
export default user.reducer
