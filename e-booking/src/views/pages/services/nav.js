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
      name: 'SPA',
      to: '/booking/services/spa',
    },
    {
      component: CNavItem,
      name: 'Swimming pool',
      to: '/booking/services/swimming-pool',
    },
    {
      component: CNavItem,
      name: 'Laundry',
      to: '/booking/services/laundry',
    },
    {
      component: CNavItem,
      name: 'Dry cleaning',
      to: '/booking/services/dry-cleaning',
    },
    {
      component: CNavItem,
      name: 'Create service category',
      to: '/booking/services/category/add',
    },
    {
      component: CNavItem,
      name: 'Add service',
      to: '/booking/services/add',
    },

    {
      component: CNavItem,
      name: 'All Service categories',
      to: '/booking/services/category/all',
    },
    {
      component: CNavItem,
      name: 'All services',
      to: '/booking/services/all',
    },
  ],
}
