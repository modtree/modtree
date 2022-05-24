import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ModuleCondensed } from 'database'

/**
 * filter, but two ways
 * @param {T[]} array: the array to split in two
 * @param {function} check: the same as filter callback
 * @return {[T[], T[]]} the pass-fail array
 */
function partition<T>(array: T[], check: (elem: T) => boolean): [T[], T[]] {
  return array.reduce(
    (result: [pass: T[], fail: T[]], element) => {
      result[check(element) ? 0 : 1].push(element)
      return result
    },
    [[], []]
  )
}

type State = {
  moduleCondensed: ModuleCondensed[]
}

export type BuilderState = {
  builder: State
}

const initialState: State = {
  moduleCondensed: [],
}

export const builder = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    toggleBuilderModule: (state, action: PayloadAction<ModuleCondensed>) => {
      const p = action.payload
      const [match, noMatch] = partition(state.moduleCondensed, x => x.moduleCode === p.moduleCode)
      if (match.length === 0) {
        noMatch.push(p)
      }
      state.moduleCondensed = noMatch
    },
  },
})

export const { toggleBuilderModule } = builder.actions
export default builder.reducer
