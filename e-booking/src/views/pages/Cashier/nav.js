import { CNavGroup, CNavItem } from '@coreui/react'
import { GiTakeMyMoney } from 'react-icons/gi'

export const CashierNav = {
  component: CNavGroup,
  name: 'Cashier',
  to: '/booking/cashier',
  icon: <GiTakeMyMoney customClassName="nav-icon" className="me-3" size={36} />,
  items: [
    {
      component: CNavItem,
      name: 'Sells pending ',
      to: '/booking/cashier/sells/pending',
    },
    {
      component: CNavItem,
      name: 'Sells ',
      to: '/booking/cashier/sells',
    },
    {
      component: CNavItem,
      name: 'Customer bills ',
      to: '/cashier/customerbills',
    },
    {
      component: CNavItem,
      name: 'Pos bon de commande ',
      to: '/cashier/posbonbills',
    },

    {
      component: CNavItem,
      name: 'Cash transaction ',
      to: '/booking/cashier/transaction',
    },
    {
      component: CNavItem,
      name: 'Cash Vaucher ',
      to: '/booking/cashier/vauchers',
    },
    {
      component: CNavItem,
      name: 'Cash report ',
      to: '/booking/cashier/report',
    },
    {
      component: CNavItem,
      name: 'All Purchase orders',
      to: '/booking/requests/cashier/all',
    },
  ],
}
