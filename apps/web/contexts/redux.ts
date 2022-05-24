import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './moduleSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
})
