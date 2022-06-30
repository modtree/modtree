import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'
import { IUser, IModule } from '@modtree/types'

export const user = createSlice({
  name: 'user',
  initialState: baseInitialState.user,
  reducers: {
    updateModulesDone: (user, action: PayloadAction<IModule[]>) => {
      user.modulesDone = action.payload
    },
    updateModulesDoing: (user, action: PayloadAction<IModule[]>) => {
      user.modulesDoing = action.payload
    },
    setUser: (user, action: PayloadAction<IUser>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        user[key] = value
      })
    },
  },
})

export const { updateModulesDone, updateModulesDoing, setUser } = user.actions
export default user.reducer
