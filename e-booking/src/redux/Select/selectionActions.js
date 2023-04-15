import selectActionTypes from './selectActionTypes'

export const selectItem = (payload) => {
  return {
    type: selectActionTypes.SELECT,
    payload,
  }
}
