import ServiceCategoryAdd from './ServiceCategoryAdd'
import ServiceCategories from './ServiceCategories'
import ServiceSell from './ServiceSell'
import ServicesAdd from './ServicesAdd'
import ServiceEdit from './ServiceEdit'
import Services from './Services'
import AllServiceSells from './AllServiceSells'

export const serviceRoutes = [
  {
    path: '/booking/services/category/add',
    exact: true,
    name: 'Create Service Category',
    element: ServiceCategoryAdd,
  },
  {
    path: '/booking/services/category/all',
    exact: true,
    name: 'All Service Categories',
    element: ServiceCategories,
  },
  {
    path: '/booking/services/spa',
    exact: true,
    name: 'Service sells',
    element: ServiceSell,
  },
  {
    path: '/booking/services/laundry',
    exact: true,
    name: 'Service sells',
    element: ServiceSell,
  },
  {
    path: '/booking/services/dry-cleaning',
    exact: true,
    name: 'Service sells',
    element: ServiceSell,
  },
  {
    path: '/booking/services/swimming-pool',
    exact: true,
    name: 'Service sells',
    element: ServiceSell,
  },
  {
    path: '/booking/services/:service/allSells',
    exact: true,
    name: 'All service sells',
    element: AllServiceSells,
  },
  {
    path: '/booking/services/add',
    exact: true,
    name: 'Service',
    element: ServicesAdd,
  },
  {
    path: '/booking/services/edit',
    exact: true,
    name: 'Service',
    element: ServiceEdit,
  },
  {
    path: '/booking/services/all',
    exact: true,
    name: 'Service',
    element: Services,
  },
]
