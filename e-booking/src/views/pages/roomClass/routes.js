import RoomClassAdd from './RoomClassAdd'
import RoomClasses from './RoomClasses'
import RoomClassEdit from './RoomClassEdit'

export const roomClassRoutes = [
  {
    path: 'booking/rooms/class/add',
    exact: true,
    name: 'Add room class',
    element: RoomClassAdd,
  },
  {
    path: 'booking/rooms/class/all',
    exact: true,
    name: 'All room class',
    element: RoomClasses,
  },
  {
    path: 'booking/rooms/class/edit',
    exact: true,
    name: 'All room class',
    element: RoomClassEdit,
  },
]
