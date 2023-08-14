import selectActionTypes from './selectActionTypes'

const initialState = {
  selected: {},
  selectedPetitStock: {},
  selectedStockItem: {},
  selectedStore: {},
  selectedEventSheet: {},
}
const selectionReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case selectActionTypes.SELECT:
      return { ...state, selected: payload }
    case selectActionTypes.SELECT_PETIT_STOCK:
      return { ...state, selectedPetitStock: payload }
    case selectActionTypes.SELECT_STOCK_ITEM:
      return { ...state, selectedStockItem: payload }
    case selectActionTypes.SELECT_STORE:
      return { ...state, selectedStore: payload }
    case selectActionTypes.SELECT_EVENT_SHEET:
      return { ...state, selectedEventSheet: payload }
    default:
      return { ...state }
  }
}
export default selectionReducer
