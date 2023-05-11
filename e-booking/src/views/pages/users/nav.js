import { cilPeople } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'
export const UsersNav = {
  component: CNavGroup,
  name: 'User',
  to: '/users',
  icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Add User ',
      to: '/booking/user/add',
    },
    {
      component: CNavItem,
      name: 'All Users',
      to: '/booking/users',
    },
    {
      component: CNavItem,
      name: 'Add user roles',
      to: '/booking/user/roles/add',
    },
    {
      component: CNavItem,
      name: 'User roles ',
      to: '/booking/user/roles',
    },
  ],
}
