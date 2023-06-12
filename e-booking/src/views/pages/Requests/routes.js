import RequestToCashier from './RequestToCashier'
import AllRequestToCashier from './AllRequestToCashier'
import ViewRequestToCashier from './ViewRequestToCashier'
import StorePurchaseOrder from '../stock/StorePurchaseOrder'

export const requestRoutes = [
  {
    path: '/booking/store/purchase',
    exact: true,
    name: 'Store Cashier request',
    element: StorePurchaseOrder,
  },
  {
    path: '/booking/requests/cashier',
    exact: true,
    name: 'Cashier request',
    element: RequestToCashier,
  },
  {
    path: '/booking/requests/cashier/all',
    exact: true,
    name: 'All Cashier request',
    element: AllRequestToCashier,
  },
  {
    path: '/booking/requests/cashier/view',
    exact: true,
    name: 'View Request To Cashier',
    element: ViewRequestToCashier,
  },
]
