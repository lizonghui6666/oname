import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import template from './reducer/template'

const originalReducers = {
  template
};

const reducer = combineReducers(originalReducers);

const middlewares = [thunk]

const store = createStore(reducer, {}, applyMiddleware(...middlewares))

export default store