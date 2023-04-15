import notificationTypes from './notificicationTypes'

export const success = (payload) => ({
  type: notificationTypes.SUCCESS,
  payload,
})
export const fail = (payload) => ({
  type: notificationTypes.FAIL,
  payload: {
    text: payload.text,
    color: payload.color,
  },
})
