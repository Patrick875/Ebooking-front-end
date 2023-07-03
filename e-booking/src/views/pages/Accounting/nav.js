import { CNavGroup, CNavItem } from '@coreui/react'
import { AiFillDollarCircle } from 'react-icons/ai'
export const AccountingNav = {
  component: CNavGroup,
  name: 'Accounting',
  to: '/booking/Accounting',
  icon: (
    <AiFillDollarCircle customClassName="nav-icon" className="me-3" size={36} />
  ),
  items: [
    {
      component: CNavItem,
      name: 'Invoices ',
      to: '/booking/accounting/invoice',
    },
    {
      component: CNavItem,
      name: 'Pro forma invoice ',
      to: '/booking/accounting/proformainvoice',
    },
    {
      component: CNavItem,
      name: 'Purchase order',
      to: '/booking/accounting/purchaseorder',
    },
    {
      component: CNavItem,
      name: 'Delivery note ',
      to: '/booking/accounting/delivery',
    },
  ],
}
