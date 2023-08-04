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
      name: 'Check In',
      to: '/booking/reservations/check-in',
    },
    {
      component: CNavItem,
      name: 'Add Reservation',
      to: '/booking/reservations/add',
    },
    {
      component: CNavItem,
      name: 'Room Reservations',
      to: '/booking/reservations/rooms',
    },
    {
      component: CNavItem,
      name: 'Hall Reservations',
      to: '/booking/reservations/halls',
    },
    {
      component: CNavItem,
      name: 'Reservation reports',
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
