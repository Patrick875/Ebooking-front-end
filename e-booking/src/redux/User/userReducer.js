const { USER_ACTIONS } = require('./userActionTypes')

const userReducer = (
  state = { users: {}, selectedUser: {} },
  { type, payload },
) => {
  switch (type) {
    case USER_ACTIONS.SELECT:
      return { ...state, selectedUser: payload }
    case USER_ACTIONS.UPDATE:
      console.log('HAPAPAPAPA')
      return { ...state, users: [...payload.payloadLocal] }
    case USER_ACTIONS.DELETE:
      console.log('before delete reducer', payload)
      return { ...state, users: [...payload.payloadLocal] }
    case USER_ACTIONS.GET_USERS:
      return { ...state, users: payload }
    default:
      return { ...state, selectedUser: {}, users: [] }
  }
}
export default userReducer
