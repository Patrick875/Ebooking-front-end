import { STOCK_ITEM_ACTIONS_TYPES } from './StockItemActionTypes'

const ItemReducer = (state = { stockItems: [] }, { type, payload }) => {
  switch (type) {
    case STOCK_ITEM_ACTIONS_TYPES.GET_ITEMS:
      console.log('TESTINGGGGGG', payload)
      return { ...state, stockItems: payload }
    case STOCK_ITEM_ACTIONS_TYPES.CREATE_ITEMS:
      return { ...state, stockItems: [...state.stockItems, payload] }
    default:
      return { ...state }
  }
}
export default ItemReducer
