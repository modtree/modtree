import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ModtreeApiResponse } from '@modtree/types'
import { EmptyResponse } from '@modtree/utils'

type State = {
  user: ModtreeApiResponse.User
  degree: ModtreeApiResponse.Degree
  graph: ModtreeApiResponse.Graph
}

export type UserState = {
  base: State
}

const initialState: State = {
  user: EmptyResponse.User,
  degree: EmptyResponse.Degree,
  graph: EmptyResponse.Graph,
}

export const base = createSlice({
  name: 'base',
  initialState,
  reducers: {
    setBaseUser: (state, action: PayloadAction<ModtreeApiResponse.User>) => {
      state.user = action.payload
    },
    setBaseDegree: (
      state,
      action: PayloadAction<ModtreeApiResponse.Degree>
    ) => {
      state.degree = action.payload
    },
    setBaseGraph: (state, action: PayloadAction<ModtreeApiResponse.Graph>) => {
      state.graph = action.payload
    },
  },
})

export const { setBaseUser, setBaseDegree, setBaseGraph } = base.actions
export default base.reducer
