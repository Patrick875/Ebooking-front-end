import selectActionTypes from './selectActionTypes'

const initialState = { selected: {} }
const selectionReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case selectActionTypes.SELECT:
      return { ...state, selected: payload }
    default:
      return { ...state }
  }
}
export default selectionReducer
