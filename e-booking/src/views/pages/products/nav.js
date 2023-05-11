import { cilBasket, cilSave } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'
export const ProductsNav = {
  component: CNavGroup,
  name: 'Products',
  to: '/Products',
  icon: <CIcon icon={cilSave} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Add products',
      to: '/booking/products/add',
    },
    {
      component: CNavItem,
      name: 'All Products',
      to: '/booking/products/all',
    },
  ],
}
export const PackagesNav = {
  component: CNavGroup,
  name: 'Packages',
  to: '/booking/services',
  icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Add product category',
      to: '/booking/products/categories/add',
    },
    {
      component: CNavItem,
      name: 'All product categories',
      to: '/booking/products/categories/all',
    },
    {
      component: CNavItem,
      name: 'Add product package',
      to: '/booking/products/packages/add',
    },
    {
      component: CNavItem,
      name: 'All product packages',
      to: '/booking/products/packages/all',
    },
  ],
}
