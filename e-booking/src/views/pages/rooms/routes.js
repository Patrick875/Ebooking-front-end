import RoomAdd from './roomAdd'
import Rooms from './Room'

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
]
