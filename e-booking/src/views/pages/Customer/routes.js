import Customers from './Customers'
import CustomerAdd from './CustomerAdd'
import CustomerView from './CustomerView'
import CustomerEdit from './CustomerEdit'

export const customerRoutes = [
  {
    path: '/customers',
    exact: true,
    name: 'All customers',
    element: Customers,
  },
  {
    path: '/customers/add',
    exact: true,
    name: 'Add customer',
    element: CustomerAdd,
  },
  {
    path: '/customers/info',
    exact: true,
    name: 'View customer',
    element: CustomerView,
  },
  {
    path: '/customers/edit',
    exact: true,
    name: 'Edit customer',
    element: CustomerEdit,
  },
]
