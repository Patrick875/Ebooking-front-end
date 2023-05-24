import { cilStorage } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'
export const StockNav = {
  component: CNavGroup,
  name: 'Stock',
  to: '/stock',
  icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Add Stock',
      to: '/booking/stock/add',
    },
    {
      component: CNavItem,
      name: 'All stores',
      to: '/booking/store/all',
    },
    {
      component: CNavItem,
      name: 'Create store',
      to: '/booking/store/create',
    },
    {
      component: CNavItem,
      name: 'All Stock',
      to: '/booking/stock/available',
    },
    {
      component: CNavItem,
      name: 'Purchase order',
      to: '/booking/requests/cashier',
    },
    {
      component: CNavItem,
      name: 'All Purchase orders',
      to: '/booking/stock/purchaseOrders',
    },
    {
      component: CNavItem,
      name: 'All Receive Vouchers',
      to: '/booking/stock/received',
    },

    {
      component: CNavItem,
      name: 'Outgoing Request',
      to: '/booking/stock/request/out',
    },
    {
      component: CNavItem,
      name: 'Stock report',
      to: '/booking/stock/report',
    },
  ],
}
