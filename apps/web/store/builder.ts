import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ModuleCondensed } from 'database'
import { partition } from '@/utils/array'

type State = {
  moduleCondensed: ModuleCondensed[]
  showBuilder: boolean
}

export type BuilderState = {
  builder: State
}

const initialState: State = {
  moduleCondensed: [],
  showBuilder: false,
}

export const builder = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    showBuilder: (state) => {
      state.showBuilder = true
    },
    hideBuilder: (state) => {
      state.showBuilder = false
    },
    toggleBuilderModule: (state, action: PayloadAction<ModuleCondensed>) => {
      const p = action.payload
      const [match, noMatch] = partition(
        state.moduleCondensed,
        (x) => x.moduleCode === p.moduleCode
      )
      if (match.length === 0) {
        noMatch.push(p)
      }
      state.moduleCondensed = noMatch
    },
    clearBuilderModules: (state) => {
      state.moduleCondensed = []
    },
  },
})

export const {
  toggleBuilderModule,
  clearBuilderModules,
  showBuilder,
  hideBuilder,
} = builder.actions
export default builder.reducer
