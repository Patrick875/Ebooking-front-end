import { toast } from 'react-hot-toast'
import { instance, getTokenPromise } from 'src/API/AxiosInstance'
import { CATEGORY_ACTIONS } from './categoriesActionTypes'

// const baseUrl = 'http://localhost:5000/api/v1/'
// const baseUrlLiveProduct = 'http://206.81.29.111:80/api/v1/products/category/'
// const baseUrlLiveService = 'http://206.81.29.111:80/api/v1/products/category/'

export const createProductCategory = function (payload) {
  return async function (dispatch) {
    console.log('his payload', payload)
    await await getTokenPromise().then(async () => {
      await instance
        .post(`/products/category/add`, payload)
        .then((res) => {
          dispatch({
            type: CATEGORY_ACTIONS.CREATE_PRODUCT_CATEGORY,
            payload: res.data.data,
          })
          toast.success('product category created')
        })
        .catch((err) => {
          console.log('err', err)
        })
    })
  }
}

export const createServiceCategory = function (payload) {
  return async function (dispatch) {
    await instance
      .get(`/products/category/add`)
      .then((res) => {
        dispatch({
          type: CATEGORY_ACTIONS.GET_PRODUCT_CATEGORIES,
          payload: res.data.data,
        })
        toast.success('service category created')
      })
      .catch((err) => {
        console.log('err', err)
        dispatch({ type: CATEGORY_ACTIONS.GET_PRODUCT_CATEGORIES, payload: [] })
      })
  }
}

export const getProductCategories = function () {
  return async function (dispatch) {
    await instance
      .get(`/products/category/all`)
      .then((res) => {
        dispatch({
          type: CATEGORY_ACTIONS.GET_PRODUCT_CATEGORIES,
          payload: res.data.data,
        })
      })
      .catch((err) => {
        console.log('err', err)
        dispatch({ type: CATEGORY_ACTIONS.GET_PRODUCT_CATEGORIES, payload: [] })
      })
  }
}
export const getServiceCategories = function () {
  return async function (dispatch) {
    await instance
      .get(`/products/category/all`)
      .then((res) => {
        dispatch({
          type: CATEGORY_ACTIONS.GET_SERVICE_CATEGORIES,
          payload: res.data.data,
        })
      })
      .catch((err) => {
        console.log('err', err)
        dispatch({ type: CATEGORY_ACTIONS.GET_SERVICE_CATEGORIES, payload: [] })
      })
  }
}
