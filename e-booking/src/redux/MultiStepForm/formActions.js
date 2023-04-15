import { FORM_ACTIONS } from './formActionTypes'

export const setFormData = (data) => {
  return {
    type: FORM_ACTIONS.SET_FORM_DATA,
    payload: data,
  }
}
export const setCurrentStep = (step) => {
  return {
    type: FORM_ACTIONS.SET_CURRENT_STEP,
    payload: step,
  }
}
