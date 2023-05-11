import AllStores from './AllStores'
import CreateStore from './CreateStore'
import StoreView from './StoreView'

export const storeRoutes = [
  {
    path: '/booking/store/create',
    exact: true,
    name: 'Create Store',
    element: CreateStore,
  },
  {
    path: '/booking/store/view',
    exact: true,
    name: ' Store details',
    element: StoreView,
  },

  {
    path: '/booking/store/all',
    exact: true,
    name: 'All Stores',
    element: AllStores,
  },
]
