import { cilSpeedometer } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavItem } from '@coreui/react'

export const DashboardNav = {
  component: CNavItem,
  name: 'Dashboard',
  to: '/dashboard',
  icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  badge: {
    color: 'info',
  },
}
