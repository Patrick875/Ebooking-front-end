import { RESERVATION_ACTIONS } from './reservationActionTypes'

const initialState = {
  selectedRoom: {},
}
const reservationsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RESERVATION_ACTIONS.SELECT_ROOM_FROM_CLASSES:
      return { ...state, selectedRoom: payload }
    case RESERVATION_ACTIONS.DESELECT_ROOM_FROM_CLASSES:
      return { ...state, selectedRoom: {} }
    default:
      return { ...state }
  }
}
export default reservationsReducer
