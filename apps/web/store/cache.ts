import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'
import { Modtree } from 'types'
import { ModuleCondensed } from '@modtree/entity'

export const cache = createSlice({
  name: 'cache',
  initialState: baseInitialState.cache,
  reducers: {
    addDegreeToCache: (cache, action: PayloadAction<Modtree.Degree>) => {
      cache.degrees[action.payload.id] = action.payload
    },
    addModulesCondensedToCache: (
      cache,
      action: PayloadAction<ModuleCondensed[]>
    ) => {
      action.payload.forEach((module) => {
        cache.modulesCondensed[module.moduleCode] = module
      })
    },
    addModulesToCache: (cache, action: PayloadAction<Modtree.Module[]>) => {
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
export default cache.reducer
