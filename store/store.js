import { createStore, combineReducers, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { userReducer } from './reducer'

const allReducers = combineReducers({
  user: userReducer
})

export default function initializeStore(state) {
  const store = createStore(
    allReducers,
    Object.assign({}, state),
    composeWithDevTools(applyMiddleware(reduxThunk))
  )
  return store
}
