import { cilHouse } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'
export const RoomNav = {
  component: CNavGroup,
  name: 'Room',
  to: '/rooms',
  icon: <CIcon icon={cilHouse} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Add Room ',
      to: '/booking/rooms/add',
    },
    {
      component: CNavItem,
      name: 'All Rooms',
      to: '/booking/rooms/available',
    },
  ],
}
