import selectActionTypes from './selectActionTypes'

const initialState = { selected: {}, selectedPetitStock: {} }
const selectionReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case selectActionTypes.SELECT:
      return { ...state, selected: payload }
    case selectActionTypes.SELECT_PETIT_STOCK:
      return { ...state, selectedPetitStock: payload }
    default:
      return { ...state }
  }
}
export default selectionReducer
