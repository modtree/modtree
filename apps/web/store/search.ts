import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Module, ModuleCondensed } from 'database'

type State = {
  moduleCondensed: ModuleCondensed[]
  module: Module[]
}

export type SearchState = {
  search: State
}

const initialState: State = {
  moduleCondensed: [],
  module: [],
}

export const search = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchedModuleCondesned: (
      state,
      action: PayloadAction<ModuleCondensed[]>
    ) => {
      state.moduleCondensed = action.payload
    },
    setSearchedModule: (state, action: PayloadAction<Module[]>) => {
      state.module = action.payload
    },
    clearSearches: (state) => {
      state.moduleCondensed = []
      state.module = []
    },
  },
})

export const { setSearchedModule, setSearchedModuleCondesned, clearSearches } =
  search.actions
export default search.reducer
