import selectActionTypes from './selectActionTypes'

export const selectStore = (payload) => {
  return {
    type: selectActionTypes.SELECT_STORE,
    payload,
  }
}
