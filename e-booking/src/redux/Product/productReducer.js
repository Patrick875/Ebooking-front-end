import { PRODUCT_ACTIONS } from './productActionTypes'

const productReducer = (
  state = { products: [], selectedProduct: {} },
  { type, payload },
) => {
  switch (type) {
    case PRODUCT_ACTIONS.SELECT:
      return { ...state, selectedProduct: payload }
    case PRODUCT_ACTIONS.UPDATE:
      console.log('HAPAPAPAPA')
      return { ...state, products: [...payload.payloadLocal] }
    case PRODUCT_ACTIONS.DELETE:
      console.log('before delete reducer', payload)
      return { ...state, products: [...payload.payloadLocal] }
    case PRODUCT_ACTIONS.GET_ALL:
      return { ...state, products: [...payload] }
    case PRODUCT_ACTIONS.ADD_PRODUCT:
      return { ...state, products: [...state.products, payload] }
    default:
      return { ...state }
  }
}
export default productReducer
