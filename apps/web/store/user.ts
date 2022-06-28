import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'

export const user = createSlice({
  name: 'user',
  initialState: baseInitialState.user,
  reducers: {
    updateModulesDone: (_user, action: PayloadAction<string[]>) => {
      console.log('redux user, update mods done:', action.payload)
    },
  },
})

export const { updateModulesDone } = user.actions
export default user.reducer
