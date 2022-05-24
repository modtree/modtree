import { configureStore } from '@reduxjs/toolkit'
import flowReducer from './flow'

export default configureStore({
  reducer: {
    flow: flowReducer,
  },
})
