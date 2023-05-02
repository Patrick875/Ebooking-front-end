const { USER_ACTIONS } = require('./userActionTypes')

const userReducer = (
  state = { users: {}, selectedUser: {} },
  { type, payload },
) => {
  switch (type) {
    case USER_ACTIONS.SELECT:
      return { ...state, selectedUser: payload }
    case USER_ACTIONS.UPDATE:
      return { ...state, users: [...payload.payloadLocal] }
    case USER_ACTIONS.DELETE:
      return { ...state, users: [...payload.payloadLocal] }
    case USER_ACTIONS.GET_USERS:
      return { ...state, users: payload }
    default:
      return { ...state, selectedUser: {} }
  }
}
export default userReducer
