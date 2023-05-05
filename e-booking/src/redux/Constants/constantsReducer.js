import { CONSTANTS_ACTION_TYPES } from './constantsActionTypes'

const initialState = { constants: {}, selectedConstant: {} }
const constantsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CONSTANTS_ACTION_TYPES.SELECT_CONSTANT:
      return { ...state, selectedConstant: payload }
    case CONSTANTS_ACTION_TYPES.STORE_CONSTANTS:
      return { ...state, constants: payload }
    default:
      return { ...state }
  }
}
export default constantsReducer
