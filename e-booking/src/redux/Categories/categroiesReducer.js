import { CATEGORY_ACTIONS } from './categoriesActionTypes'

const categoryReducer = (
  state = { productCategories: [], serviceCategories: [] },
  { type, payload },
) => {
  switch (type) {
    case CATEGORY_ACTIONS.GET_PRODUCT_CATEGORIES:
      return { ...state, productCategories: payload }
    case CATEGORY_ACTIONS.CREATE_PRODUCT_CATEGORY:
      return {
        ...state,
        productCategories: [...state.productCategories, payload],
      }
    case CATEGORY_ACTIONS.GET_SERVICE_CATEGORIES:
      console.log('before reducer', payload)
      return { ...state, serviceCategories: payload }
    case CATEGORY_ACTIONS.CREATE_SERVICE_CATEGORY:
      return { ...state, serviceCategories: [...payload] }
    default:
      return { ...state, productCategories: [], serviceCategories: [] }
  }
}
export default categoryReducer
