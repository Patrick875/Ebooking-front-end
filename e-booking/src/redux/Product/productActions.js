import { toast } from 'react-hot-toast'
import { instance, getTokenPromise } from 'src/API/AxiosInstance'
import { PRODUCT_ACTIONS } from './productActionTypes'

export const selectProduct = (payload) => {
  return { type: PRODUCT_ACTIONS.SELECT, payload }
}
export const updateProduct = (payloadApi, payloadLocal) => {
  return async function (dispatch) {
    await instance
      .put(`/products/update`, { ...payloadApi })
      .then((res) => {
        dispatch({
          type: PRODUCT_ACTIONS.UPDATE,
          payload: {
            payloadApi: payloadApi,
            payloadLocal: payloadLocal,
          },
        })
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }
}
// export const deleteProduct = (payloadApi, payloadLocal) => {
//   console.log('nowowowo')
//   console.log(payloadApi, payloadLocal)
//   if (payloadLocal.length !== 0) {
//     console.log(payloadLocal)
//     payloadLocal = payloadLocal.filter((user) =>
//       product._id === payloadApi.id ? '' : product,
//     )
//     console.log(payloadLocal.length)
//   }
//   return async function (dispatch) {
//     const res = await axios
//       .delete(`${baseUrlLive}delete/${payloadApi.id}`)
//       .catch((err) => {
//         console.log('error getting products', { errMessage: err.message })

//         // dispatch({ type: USER_ACTIONS.DELETE, payload: [] });
//       })
//     if (res.status === 200) {
//       dispatch({
//         type: PRODUCT_ACTIONS.DELETE,
//         payload: {
//           payloadApi: payloadApi,
//           payloadLocal: payloadLocal,
//         },
//       })
//     }
//     // if (res.status === 200) {
//     // dispatch({
//     //   type: PRODUCT_ACTIONS.DELETE,
//     // payload: {
//     //   payloadApi: payloadApi,
//     //   payloadLocal: payloadLocal,
//     // },
//     // });
//   }
// }
export const getProducts = function () {
  return async function (dispatch) {
    await instance
      .get(`/products/all`)
      .then((res) => {
        dispatch({ type: PRODUCT_ACTIONS.GET_ALL, payload: res.data.data })
      })
      .catch((err) => {
        toast.error(err.message)
        dispatch({ type: PRODUCT_ACTIONS.GET_ALL, payload: [] })
      })
  }
}

export const createProduct = (payload, products) => {
  return async function (dispatch) {
    await instance
      .post(`/products/add`, { ...payload })
      .then((res) => {
        dispatch({
          type: PRODUCT_ACTIONS.ADD_PRODUCT,
          payload: res.data.data,
        })
        toast.success('Product created')
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }
}
