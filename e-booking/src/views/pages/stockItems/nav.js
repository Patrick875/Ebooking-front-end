import { CNavGroup, CNavItem } from '@coreui/react'
import { MdOutlineInsertDriveFile } from 'react-icons/md'
export const StockItemNav = {
  component: CNavGroup,
  name: 'Stock Items',
  to: '/stock/items',
  icon: <MdOutlineInsertDriveFile className="me-3" size={34} />,
  items: [
    {
      component: CNavItem,
      name: 'Add Stock Items',
      to: '/booking/stock/item/add',
    },
    {
      component: CNavItem,
      name: 'All Stock Items',
      to: '/booking/stock/items',
    },
  ],
}
