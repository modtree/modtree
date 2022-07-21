import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './search'
import modalReducer from './modal'
import modtree from './modtree'
import cacheReducer from './cache'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

const store = configureStore({
  reducer: {
    search: searchReducer,
    modal: modalReducer,
    modtree: modtree.reducer,
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

/** reducer namespacer */
import { r as search } from './search'
import { r as modal } from './modal'
import { r as cache } from './cache'

export const r = {
  ...modtree.actions,
  ...modal,
  ...search,
  ...cache,
} as const
