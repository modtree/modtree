import { configureStore } from '@reduxjs/toolkit'
import flowReducer from './flow'
import builderReducer from './builder'

export default configureStore({
  reducer: {
    flow: flowReducer,
    builder: builderReducer
  },
})
