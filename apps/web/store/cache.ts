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
      const existingCodes = new Set(Object.keys(cache.modulesCondensed))
      const newState = cache.modulesCondensed
      action.payload
        .filter((module) => !existingCodes.has(module.moduleCode))
        .forEach((module) => {
          newState[module.moduleCode] = module
        })
      cache.modulesCondensed = newState
    },
    addModules: (cache, action: PayloadAction<ModtreeApiResponse.Module[]>) => {
      const existingCodes = new Set(Object.keys(cache.modules))
      const newState = cache.modules
      action.payload
        .filter((module) => !existingCodes.has(module.moduleCode))
        .forEach((module) => {
          newState[module.moduleCode] = module
        })
      cache.modules = newState
    },
  },
})

export const { addModulesCondensed, addModules } = cache.actions
export default cache.reducer
