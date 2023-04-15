//jshint esversion:9
const { IS_AUTH } = require('./AuthActionTypes')

const authReducer = (state = { isAuth: false }, { type, payload }) => {
  switch (type) {
    case IS_AUTH.IS_AUTH:
      return { ...state, isAuth: payload.isAuth, user: payload.user }
    case IS_AUTH.LOGIN:
      return {
        ...state,
        isAuth: payload.isAuth,
        jwt: payload.jwt,
        user: payload.user,
        role: payload.role,
        access: payload.access,
        permission: payload.permission,
      }
    case IS_AUTH.REGISTER:
      return { ...state, isAuth: payload.isAuth }
    case IS_AUTH.LOGOUT:
      return { ...state, isAuth: false, user: null, role: null }
    default:
      return { ...state }
  }
}
export default authReducer
