//jshint esversion:9
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'
import { STOCK_ITEM_ACTIONS_TYPES } from './StockItemActionTypes'

export const getStockItems = () => {
  return async function (dispatch) {
    await instance
      .get('stock/item/all')
      .then((res) => {
        dispatch({
          type: STOCK_ITEM_ACTIONS_TYPES.GET_ITEMS,
          payload: res.data.data,
        })
      })
      .catch((err) => {
        console.log({
          errorMessage: err.message,
          customMessage: 'error fetching stock items',
        })
        dispatch({
          type: STOCK_ITEM_ACTIONS_TYPES.GET_ITEMS,
          payload: [],
        })
      })
  }
}
export const addStockItem = (payload) => {
  return async function (dispatch) {
    await instance
      .post(`/stock/item/add`, payload)
      .then(() => {
        dispatch({
          type: STOCK_ITEM_ACTIONS_TYPES.CREATE_ITEMS,
          payload,
        })
        toast.success('Item added to stock')
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
export const bookRoom = (payload) => {
  return async function (dispatch) {
    await instance
      .put(`/rooms/${payload.id}`, {
        isBooked: true,
      })
      .then((res) => {
        if (res) {
          console.log(res.data.status)
        }
      })
      .catch((err) => {
        console.log({ errMessage: err.message })
        dispatch({
          type: STOCK_ITEM_ACTIONS_TYPES.BOOK_ROOM,
          payload: null,
        })
      })
  }
}
export const releaseRoom = (payload) => {
  return async function (dispatch) {
    await instance
      .put(`/rooms/${payload.id}`, {
        isBooked: false,
      })
      .then((res) => {
        if (res) {
          console.log(res.data.status)
        }
      })
      .catch((err) => {
        console.log({ errMessage: err.message })
        dispatch({
          type: STOCK_ITEM_ACTIONS_TYPES.RELEASE_ROOM,
          payload: null,
        })
      })
  }
}
