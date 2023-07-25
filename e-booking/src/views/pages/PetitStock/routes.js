import AllPetitStock from './AllPetitStock'
import CreatePetitStock from './CreatePetitStock'
import AllBarItems from './AllBarItems'
import RequestBarItem from './RequestBarItem'
import AllBarRequest from './AllBarRequest'
import BarSells from './BarSells'
import UpdateStockQuantity from './UpdateStockQuantity'

export const petitStockRoutes = [
  {
    path: '/booking/petitstock/all',
    exact: true,
    name: 'All petit stocks',
    element: AllPetitStock,
  },
  {
    path: '/booking/petitstock/create',
    exact: true,
    name: 'Create petit stock',
    element: CreatePetitStock,
  },
  {
    path: '/booking/petitstock/items/all',
    exact: true,
    name: 'All Petit stock items',
    element: AllBarItems,
  },
  {
    path: '/booking/petitstock/items/update',
    exact: true,
    name: 'Update Stock quantity',
    element: UpdateStockQuantity,
  },
  {
    path: '/booking/petitstock/request',
    exact: true,
    name: 'Request petit stock Item',
    element: RequestBarItem,
  },
  {
    path: '/booking/petit/request/all',
    exact: true,
    name: 'All petit Requests',
    element: AllBarRequest,
  },
  {
    path: '/booking/bar/sells',
    exact: true,
    name: 'Bar sells',
    element: BarSells,
  },
]
