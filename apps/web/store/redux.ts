import { configureStore } from '@reduxjs/toolkit'
import flowReducer from './flow'
import builderReducer from './builder'
import searchReducer from './search'
import modalReducer from './modal'
import baseReducer from './base'

export default configureStore({
  reducer: {
    flow: flowReducer,
    builder: builderReducer,
    search: searchReducer,
    modal: modalReducer,
    base: baseReducer,
  },
})
