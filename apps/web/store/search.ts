import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Module, ModuleCondensed } from '@modtree/entity'
import { baseInitialState } from './initial-state'

export const search = createSlice({
  name: 'search',
  initialState: baseInitialState.search,
  reducers: {
    setBuildTitle: (state, action: PayloadAction<string>) => {
      state.buildTitle = action.payload
    },
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
    clearBuildList: (state) => {
      state.buildList = []
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
  clearBuildList,
  addToBuildList,
  removeFromBuildList,
  setBuildTitle,
  setBuildList,
} = search.actions
export default search.reducer
