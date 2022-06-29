import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'
import { ModtreeApiResponse } from '@modtree/types'
import { WritableDraft } from 'immer/dist/internal'
import { ModuleCondensed } from '@modtree/entity'

const getState = <T>(state: WritableDraft<Record<string, T>>) => {
  return {
    existingKeys: new Set(Object.keys(state)),
    newState: state,
  }
}

export const cache = createSlice({
  name: 'cache',
  initialState: baseInitialState.cache,
  reducers: {
    addDegreeToCache: (
      cache,
      action: PayloadAction<ModtreeApiResponse.Degree>
    ) => {
      const { existingKeys, newState } = getState(cache.degrees)
      if (!existingKeys.has(action.payload.id)) {
        newState[action.payload.id] = action.payload
      }
    },
    addModulesCondensedToCache: (
      cache,
      action: PayloadAction<ModuleCondensed[]>
    ) => {
      const newState = cache.modulesCondensed
      action.payload.forEach((module) => {
        newState[module.moduleCode] = module
      })
      cache.modulesCondensed = newState
    },
    addModulesToCache: (
      cache,
      action: PayloadAction<ModtreeApiResponse.Module[]>
    ) => {
      const { existingKeys, newState } = getState(cache.modules)
      action.payload
        .filter((module) => !existingKeys.has(module.moduleCode))
        .forEach((module) => {
          newState[module.moduleCode] = module
        })
      cache.modules = newState
    },
  },
})

export const {
  addModulesCondensedToCache,
  addModulesToCache,
  addDegreeToCache,
} = cache.actions
export default cache.reducer
