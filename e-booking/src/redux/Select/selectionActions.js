import selectActionTypes from './selectActionTypes'

export const selectItem = (payload) => {
  return {
    type: selectActionTypes.SELECT,
    payload,
  }
}
export const selectEventSheet = (payload) => {
  return {
    type: selectActionTypes.SELECT_EVENT_SHEET,
    payload,
  }
}
