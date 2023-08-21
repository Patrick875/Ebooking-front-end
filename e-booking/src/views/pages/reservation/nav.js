import { cilSave } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'

export const ReceptionNav = {
  component: CNavGroup,
  name: 'Receiption',
  to: '/Reservations',
  icon: <CIcon icon={cilSave} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Add Hall Reservation',
      to: '/booking/reservations/add',
    },
    {
      component: CNavItem,
      name: 'Hall Reservations',
      to: '/booking/reservations/halls',
    },
    {
      component: CNavItem,
      name: 'All Reservations report',
      to: '/reports/reservations',
    },
    {
      component: CNavItem,
      name: 'Daily sales report',
      to: '/reports/receiption/create',
    },
    {
      component: CNavItem,
      name: 'All Daily sales reports',
      to: '/reports/receiption/all',
    },
  ],
}
