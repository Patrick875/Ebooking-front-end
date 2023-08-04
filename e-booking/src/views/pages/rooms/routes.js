import RoomAdd from './roomAdd'
import Rooms from './Room'
import RoomCheckin from './RoomCheckin'
import AddBill from '../reservation/AddBill'

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
    element: RoomCheckin,
  },
  {
    path: '/booking/room/addbill',
    exact: true,
    name: 'Room AddBill',
    keyword: 'Room AddBill',
    element: AddBill,
  },
]
