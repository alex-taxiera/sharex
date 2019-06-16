import { createStore as store, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import rootReducer from './reducers'

export const createStore = (initialState) =>
  store(rootReducer, initialState, applyMiddleware(thunk, logger))

export { INITIAL_STATE } from './reducers'
