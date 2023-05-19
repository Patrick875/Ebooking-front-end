import { CNavGroup, CNavItem } from '@coreui/react'
import { FaFileContract } from 'react-icons/fa'

export const ContractNav = {
  component: CNavGroup,
  name: 'Contracts',
  to: '/contract',
  icon: (
    <FaFileContract customClassName="nav-icon" className="me-3" size={28} />
  ),
  items: [
    {
      component: CNavItem,
      name: 'Create contract',
      to: '/contract/new',
    },
    {
      component: CNavItem,
      name: 'All Contracts ',
      to: '/contract/all',
    },
  ],
}
