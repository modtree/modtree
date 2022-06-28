import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'
import { ModtreeApiResponse } from '@modtree/types'

export const cache = createSlice({
  name: 'cache',
  initialState: baseInitialState.cache,
  reducers: {
    addModulesCondensed: (
      cache,
      action: PayloadAction<ModtreeApiResponse.ModuleCondensed[]>
    ) => {
      const newState = new Set(cache.modulesCondensed)
      action.payload.forEach((module) => {
        newState.add(module)
      })
      cache.modulesCondensed = newState
    },
    addModules: (cache, action: PayloadAction<ModtreeApiResponse.Module[]>) => {
      const newState = new Set(cache.modules)
      action.payload.forEach((module) => {
        newState.add(module)
      })
      cache.modules = newState
    },
  },
})

export const { addModulesCondensed, addModules } = cache.actions
export default cache.reducer
