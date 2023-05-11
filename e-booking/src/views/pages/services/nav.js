import { cilSatelite } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'
export const ServicesNav = {
  component: CNavGroup,
  name: 'Services',
  to: '/booking/services',
  icon: <CIcon icon={cilSatelite} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Create service category',
      to: '/booking/services/category/add',
    },
    {
      component: CNavItem,
      name: 'Service categories',
      to: '/booking/services/category/all',
    },
    {
      component: CNavItem,
      name: 'Sell service',
      to: '/booking/services/sell',
    },
    {
      component: CNavItem,
      name: 'Add service',
      to: '/booking/services/add',
    },
    {
      component: CNavItem,
      name: 'All services',
      to: '/booking/services/all',
    },
  ],
}
