import {
  LOGOUT
} from '../constants'

function userReducer(state={}, action) {
  switch (action.type) {
    case LOGOUT:
      return {}
    default:
      return state
  }
}

export default userReducer