import { IDegree, IModule, IModuleCondensed } from '@modtree/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'

export const cache = createSlice({
  name: 'cache',
  initialState: baseInitialState.cache,
  reducers: {
    addDegreeToCache: (cache, action: PayloadAction<IDegree>) => {
      cache.degrees[action.payload.id] = action.payload
    },
    addModulesCondensedToCache: (
      cache,
      action: PayloadAction<IModuleCondensed[]>
    ) => {
      action.payload.forEach((module) => {
        cache.modulesCondensed[module.moduleCode] = module
      })
    },
    addModulesToCache: (cache, action: PayloadAction<IModule[]>) => {
      action.payload.forEach((module) => {
        cache.modules[module.moduleCode] = module
      })
    },
  },
})

export const {
  addModulesCondensedToCache,
  addModulesToCache,
  addDegreeToCache,
} = cache.actions
export const r = cache.actions
export default cache.reducer
