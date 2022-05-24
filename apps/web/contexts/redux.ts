import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './moduleSlice'
import treeSelection from './treeSelection'

export default configureStore({
  reducer: {
    counter: counterReducer,
    treeSelection,
  },
})
