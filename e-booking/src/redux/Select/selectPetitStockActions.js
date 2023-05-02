import selectActionTypes from './selectActionTypes'

export const selectPetitStock = (payload) => {
  return {
    type: selectActionTypes.SELECT_PETIT_STOCK,
    payload,
  }
}
