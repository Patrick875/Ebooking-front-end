//jshint esversion:9
import notificationTypes from './Notifications/notificicationTypes'

export const errorFunction = (dispatch, err, IS_AUTH) => {
  console.log({ errMessage: err.message })
  // dispatch({
  //   type: IS_AUTH.REGISTER,
  //   isAuth: false,
  // })
  dispatch({
    type: notificationTypes.FAIL,
    payload: {
      text: 'User registration fialed',
      color: 'danger',
    },
  })
}
