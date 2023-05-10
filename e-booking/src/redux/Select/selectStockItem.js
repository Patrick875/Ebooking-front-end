import selectActionTypes from './selectActionTypes'

export const selectStockItem = (payload) => {
  return {
    type: selectActionTypes.SELECT_STOCK_ITEM,
    payload,
  }
}
