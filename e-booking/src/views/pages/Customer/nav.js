import { cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'

export const CustomerNav = {
  component: CNavGroup,
  name: 'Customers',
  to: '/customers',
  icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Add Customer',
      to: '/customers/add',
    },
    {
      component: CNavItem,
      name: 'All Customers',
      to: '/customers',
    },
  ],
}
