import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './search'
import modalReducer from './modal'
import graphReducer from './graph'
import userReducer from './user'
import degreeReducer from './degree'
import cacheReducer from './cache'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

const store = configureStore({
  reducer: {
    search: searchReducer,
    modal: modalReducer,
    graph: graphReducer,
    user: userReducer,
    degree: degreeReducer,
    cache: cacheReducer,
  },
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
