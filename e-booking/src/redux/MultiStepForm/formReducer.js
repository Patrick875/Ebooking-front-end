import { FORM_ACTIONS } from './formActionTypes'

const initialState = {
  formData: {},
  currentStep: 0,
}

const formReducer = (state = initialState, { type, payload }) => {
  let step
  switch (type) {
    case FORM_ACTIONS.SET_FORM_DATA:
      return {
        ...state,
        formData: payload,
      }
    case FORM_ACTIONS.SET_CURRENT_STEP:
      if (state.currentStep > 2) {
        step = 0
      } else {
        step = payload
      }
      return {
        ...state,
        currentStep: step,
      }
    default:
      return state
  }
}
export default formReducer
