import axios from 'axios'
import {
  LOGOUT
} from './constants'

export const logoutAction = () => ({
  type: LOGOUT
})

export function logout() {
  return (dispatch) => {
    axios.post('/logout').then(res => {
      if (res.status === 200) {
        dispatch(logoutAction())
      } else {
        console.error('logout failed:', res)
      }
    }).catch(err => {
      console.error('logout failed ', err)
    })
  }
}