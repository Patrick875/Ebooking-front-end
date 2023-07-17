import { RESERVATION_ACTIONS } from './reservationActionTypes'

export const selectRoom = (payload) => {
  return {
    type: RESERVATION_ACTIONS.SELECT_ROOM_FROM_CLASSES,
    payload,
  }
}
export const deselectRoom = () => {
  return {
    type: RESERVATION_ACTIONS.DESELECT_ROOM_FROM_CLASSES,
  }
}
