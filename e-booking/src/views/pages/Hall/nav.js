import { cilHouse } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'
export const HallNav = {
  component: CNavGroup,
  name: 'Halls',
  to: '/halls',
  icon: <CIcon icon={cilHouse} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'All Halls',
      to: '/booking/halls',
    },
    {
      component: CNavItem,
      name: 'Add Hall',
      to: '/booking/halls/add',
    },
    {
      component: CNavItem,
      name: 'Hall services',
      to: '/booking/halls/services',
    },
    {
      component: CNavItem,
      name: 'Add Hall services',
      to: '/booking/halls/services/add',
    },
  ],
}
