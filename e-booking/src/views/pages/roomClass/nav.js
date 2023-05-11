import { cilBook } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'
export const RoomClassNav = {
  component: CNavGroup,
  name: 'Room class',
  to: '/booking/rooms/class/',
  icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Add Room Class ',
      to: '/booking/rooms/class/add',
    },
    {
      component: CNavItem,
      name: 'All Room Class ',
      to: '/booking/rooms/class/all',
    },
  ],
}
