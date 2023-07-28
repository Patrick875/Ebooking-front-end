import { toast } from 'react-hot-toast'
import { instance, getTokenPromise } from 'src/API/AxiosInstance'
import { ROLE_ACTIONS } from './RoleActionTypes'

//const baseUrl = 'http://206.81.29.111/api/v1/roles/all';
// const baseUrl = 'http://localhost:5000/api/v1'
// const baseUrlLive = 'http://206.81.29.111:80/api/v1/roles'

export const getRoles = function () {
  return async (dispatch) => {
    await instance
      .get(`/roles/all`)
      .then((res) => {
        if (res.data) {
          dispatch({
            type: ROLE_ACTIONS.GET_ROLES,
            payload: res.data.roles,
          })
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
}
