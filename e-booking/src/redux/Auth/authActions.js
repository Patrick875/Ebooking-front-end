import { IS_AUTH } from './AuthActionTypes'
import { toast } from 'react-hot-toast'
import { instance, setToken } from 'src/API/AxiosInstance'
//import axios from 'axios'
import Cookies from 'js-cookie'

export const auth = function (payload) {
  return {
    type: IS_AUTH.IS_AUTH,
    payload,
  }
}
export const login = function (payload) {
  return async function (dispatch) {
    await instance
      .post(`/login`, payload)
      .then((res1) => {
        dispatch({
          type: IS_AUTH.LOGIN,
          payload: {
            isAuth: true,
            user: res1.data.user,
            role: res1.data.user.Role.name,
            access: res1.data.user.Role.access,
            permission: res1.data.user.Role.permission,
          },
        })
        toast.success('User Logged in')
        setToken(res1.data.accessToken)
        Cookies.set('token', res1.data.accessToken, { expires: 24 * (1 / 24) })
      })
      .catch((err) => {
        if (err && err.response && err.response.status === 401) {
          toast.error('Wrong username or password ! try again')
        } else {
          toast.error('user login failed')
        }

        dispatch({
          type: IS_AUTH.LOGIN,
          payload: {
            isAuth: false,
            user: null,
          },
        })
      })
  }
}
export const registerUser = function (payload) {
  //payload.role = Number(payload.role);
  console.log(payload)
  return async function (dispatch) {
    await instance
      .post(`users/add`, payload)
      .then((res) => {
        if (res.data.user) {
          dispatch({
            type: IS_AUTH.REGISTER,
            payload: {
              isAuth: true,
            },
          })
          toast.success('User created')
        }
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }
}

export const logout = function () {
  toast.success('User logged out')
  localStorage.setItem('token', null)
  localStorage.setItem('state', null)
  return {
    type: IS_AUTH.LOGOUT,
    isAuth: false,
  }
}

export const getUsers = function () {
  return async function (dispatch) {
    await instance
      .get('/users/all')
      .then((res) => {
        if (res.users) {
          dispatch({ type: IS_AUTH.GET_USERS, payload: res.data.users })
        }
        toast.success('users fetched')
      })
      .catch((err) => {
        console.log('error getting users', { errMessage: err.message })
        dispatch({ type: IS_AUTH.GET_USERS, payload: [] })
        toast.error(err.message)
      })
  }
}
