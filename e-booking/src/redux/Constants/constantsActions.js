import { CONSTANTS_ACTION_TYPES } from './constantsActionTypes'

export const storeConstants = (payload) => {
  return {
    type: CONSTANTS_ACTION_TYPES.STORE_CONSTANTS,
    payload,
  }
}

export const selectConstant = (payload) => {
  return {
    type: CONSTANTS_ACTION_TYPES.SELECT_CONSTANT,
    payload,
  }
}
