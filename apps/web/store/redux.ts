import { configureStore } from '@reduxjs/toolkit'
import flowReducer from './flow'
import builderReducer from './builder'
import searchReducer from './search'

export default configureStore({
  reducer: {
    flow: flowReducer,
    builder: builderReducer,
    search: searchReducer,
  },
})
