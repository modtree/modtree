import { configureStore } from '@reduxjs/toolkit'
import search from './search'
import modal from './modal'
import modtree from './modtree'
import cache from './cache'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

const store = configureStore({
  reducer: {
    search: search.reducer,
    modal: modal.reducer,
    modtree: modtree.reducer,
    cache: cache.reducer,
  },
})

/** redux action namespacer */
export const r = {
  ...modtree.actions,
  ...modal.actions,
  ...search.actions,
  ...cache.actions,
} as const

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
