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
      state.searchResults = action.payload
      state.hasResults = action.payload.length > 0
    },
    setSearchedModule: (state, action: PayloadAction<Module[]>) => {
      state.module = action.payload
      state.hasResults = action.payload.length > 0
    },
    clearSearches: (state) => {
      state.searchResults = []
      state.module = []
      state.hasResults = false
    },
    setBuildList: (state, action: PayloadAction<ModuleCondensed[]>) => {
      state.buildList = action.payload
    },
    addToBuildList: (state, action: PayloadAction<ModuleCondensed>) => {
      const codes = new Set(state.buildList.map((m) => m.moduleCode))
      if (!codes.has(action.payload.moduleCode)) {
        state.buildList = [...state.buildList, action.payload]
      }
    },
    removeFromBuildList: (state, action: PayloadAction<ModuleCondensed>) => {
      const codes = new Set(state.buildList.map((m) => m.moduleCode))
      if (codes.has(action.payload.moduleCode)) {
        state.buildList = state.buildList.filter(
          (x) => x.moduleCode !== action.payload.moduleCode
        )
      }
    },
  },
})

export const {
  setSearchedModule,
  setSearchedModuleCondensed,
  clearSearches,
  addToBuildList,
  removeFromBuildList,
  setBuildList,
} = search.actions
export default search.reducer
