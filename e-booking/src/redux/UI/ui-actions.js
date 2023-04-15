import uiActiontypes from './ui-types'

export const toggleSideBar = (state) => ({
  type: uiActiontypes.TOGGLE_SIDEBAR,
  payload: state,
})
