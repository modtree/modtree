import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Module, ModuleCondensed } from '@modtree/entity'
import { baseInitialState } from './initial-state'

export const search = createSlice({
  name: 'search',
  initialState: baseInitialState.search,
  reducers: {
    setSearchedModuleCondensed: (
      state,
      action: PayloadAction<ModuleCondensed[]>
    ) => {
      state.moduleCondensed = action.payload
      state.hasResults = action.payload.length > 0
    },
    setSearchedModule: (state, action: PayloadAction<Module[]>) => {
      state.module = action.payload
      state.hasResults = action.payload.length > 0
    },
    clearSearches: (state) => {
      state.moduleCondensed = []
      state.module = []
      state.hasResults = false
    },
  },
})

export const { setSearchedModule, setSearchedModuleCondensed, clearSearches } =
  search.actions
export default search.reducer
