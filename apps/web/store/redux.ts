import { configureStore } from '@reduxjs/toolkit'
import flowReducer from './flow'
import builderReducer from './builder'
import searchReducer from './search'
import modalReducer from './modal'
import baseReducer from './base'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

const store = configureStore({
  reducer: {
    flow: flowReducer,
    builder: builderReducer,
    search: searchReducer,
    modal: modalReducer,
    base: baseReducer,
  },
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
