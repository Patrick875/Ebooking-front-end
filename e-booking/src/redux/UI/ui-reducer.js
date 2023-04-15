import uiActiontypes from './ui-types'
const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false,
}

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case uiActiontypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarShow: !state.sidebarShow,
        sidebarUnfoldable: !state.sidebarUnfoldable,
      }
    default:
      return state
  }
}
export default uiReducer
