import RoomAdd from './roomAdd'
import Rooms from './Room'
import RoomCheckin from './RoomCheckin'
import AddBill from '../reservation/AddBill'
import RoomEntry from './RoomEntry'
import RoomReservations from '../reservation/RoomReservations'

export const roomRoutes = [
  {
    path: '/booking/rooms/add',
    exact: true,
    name: 'Add room',
    element: RoomAdd,
  },

  {
    path: '/booking/rooms/available',
    exact: true,
    name: 'Free rooms',
    keyword: 'available',
    element: Rooms,
  },
  {
    path: '/booking/room/checkin',
    exact: true,
    name: 'Room checkin',
    keyword: 'Room checkin',
    element: RoomEntry,
  },
  {
    path: '/booking/room/addbill',
    exact: true,
    name: 'Room AddBill',
    keyword: 'Room AddBill',
    element: AddBill,
  },
  {
    path: '/booking/reservations/rooms',
    exact: true,
    name: 'Room Reservation',
    element: RoomReservations,
  },
]
