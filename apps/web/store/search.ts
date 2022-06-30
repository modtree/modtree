import { IModule } from '@modtree/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'

export const search = createSlice({
  name: 'search',
  initialState: baseInitialState.search,
  reducers: {
    setBuildTitle: (state, action: PayloadAction<string>) => {
      state.buildTitle = action.payload
    },
    setBuildId: (state, action: PayloadAction<string>) => {
      state.buildId = action.payload
    },
    setSearchedModule: (state, action: PayloadAction<IModule[]>) => {
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
    setBuildList: (state, action: PayloadAction<IModule[]>) => {
      state.buildList = action.payload
    },
    addToBuildList: (state, action: PayloadAction<IModule>) => {
      const codes = new Set(state.buildList.map((m) => m.moduleCode))
      if (!codes.has(action.payload.moduleCode)) {
        state.buildList = [...state.buildList, action.payload]
      }
    },
    removeFromBuildList: (state, action: PayloadAction<IModule>) => {
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
  clearSearches,
  clearBuildList,
  addToBuildList,
  removeFromBuildList,
  setBuildTitle,
  setBuildList,
  setBuildId,
} = search.actions
export default search.reducer
