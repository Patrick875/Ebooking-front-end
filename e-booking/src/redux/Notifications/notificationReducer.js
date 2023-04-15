import notificationTypes from './notificicationTypes'

const notificationReducer = (
  state = { activate: false, text: '', color: '' },
  { type, payload },
) => {
  switch (type) {
    case notificationTypes.FAIL:
      return {
        ...state,
        activate: true,
        text: payload.text,
        color: payload.color,
      }
    case notificationTypes.SUCCESS:
      return {
        ...state,
        activate: true,
        text: payload.text,
        color: payload.color,
      }
    default:
      return state
  }
}
export default notificationReducer
