//jshint esversion:9

import rootReducer from './redux/root-reducer'
import { createStore, applyMiddleware, compose } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

// const initialState = {
//   sidebarShow: true,
// }

// const changeState = (state = initialState, { type, ...rest }) => {
//   switch (type) {
//     case 'set':
//       return { ...state, ...rest }
//     default:
//       return state
//   }
// }

function saveToLocalStorage(state) {
  try {
    localStorage.setItem('state', JSON.stringify(state))
  } catch (e) {
    console.error(e)
  }
}

function loadFromLocalStorage() {
  try {
    const stateStr = localStorage.getItem('state')
    return stateStr ? JSON.parse(stateStr) : undefined
  } catch (e) {
    console.error(e)
    return undefined
  }
}

let persistedState = loadFromLocalStorage()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  rootReducer,
  persistedState,
  composeEnhancers(applyMiddleware(thunk)),
)

store.subscribe(() => {
  try {
    const serializedState = JSON.stringify(store.getState())
    localStorage.setItem('state', serializedState)
  } catch (error) {
    console.log('Error saving state to localStorage:', error)
  }
})

export default store
