const { ROLE_ACTIONS } = require('./RoleActionTypes')

const rolesReducer = (state = { userRoles: [] }, { type, payload }) => {
  switch (type) {
    case ROLE_ACTIONS.GET_ROLES:
      return { ...state, userRoles: payload }
    case ROLE_ACTIONS.CREATE_ROLE:
      return { ...state, userRoles: [...state, payload] }
    default:
      return { ...state }
  }
}

export default rolesReducer
