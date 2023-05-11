import { cilFastfood } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'
export const PetitStockNav = {
  component: CNavGroup,
  name: 'Petit stock',
  to: '/bar',
  icon: <CIcon icon={cilFastfood} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Sell',
      to: '/booking/products/sell',
    },
    {
      component: CNavItem,
      name: 'All Petit stock',
      to: '/booking/petitstock/all',
    },
    {
      component: CNavItem,
      name: 'Create Petit stock',
      to: '/booking/petitstock/create',
    },
    {
      component: CNavItem,
      name: 'Create Table',
      to: '/booking/tables/create',
    },
    {
      component: CNavItem,
      name: 'Tables',
      to: '/booking/tables/all',
    },
  ],
}
