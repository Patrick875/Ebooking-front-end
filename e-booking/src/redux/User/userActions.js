import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'
import { USER_ACTIONS } from './userActionTypes'

export const selectUser = (payload) => ({ type: USER_ACTIONS.SELECT, payload })
export const updateUser = (payloadApi, payloadLocal) =>
  async function (dispatch) {
    await instance
      .put(`/users/update`, { ...payloadApi })
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: USER_ACTIONS.UPDATE,
            payload: {
              payloadApi,
              payloadLocal,
            },
          })
        }
        toast.success('user updated')
      })
      .catch((err) => {
        console.log('user updated failed')
      })
  }
export const deleteUser = (payloadApi, payloadLocal) => {
  if (payloadLocal.length !== 0) {
    payloadLocal = payloadLocal.map((user) =>
      user._id === payloadApi.id ? { ...user, status: 'disactive' } : user,
    )
  }
  return async function (dispatch) {
    await instance
      .get(`/users/disactivate/${payloadApi.id}`)
      .then((res) => {
        console.log('res from users', res)
        toast.success('user disactivated')
      })
      .catch((err) => {
        console.log('user disactivate failed')
      })
  }
}
export const getUsers = function () {
  return async function (dispatch) {
    await instance
      .get(`/users/all`)
      .then((res) => {
        dispatch({ type: USER_ACTIONS.GET_USERS, payload: res.data.users })
      })
      .catch(() => {
        dispatch({ type: USER_ACTIONS.GET_USERS, payload: [] })
      })
  }
}
