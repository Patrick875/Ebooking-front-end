import AddSaunaItem from './AddSaunaItem'
import AllSaunaItems from './AllSaunaItems'
import AllSaunaRequest from './AllSaunaRequest'
import RequestSaunaItem from './RequestSaunaItem'

export const saunaRoutes = [
  {
    path: '/booking/sauna/add',
    exact: true,
    name: 'Add Bar Item',
    element: AddSaunaItem,
  },
  {
    path: '/booking/sauna/all',
    exact: true,
    name: 'All Bar items',
    element: AllSaunaItems,
  },
  {
    path: '/booking/sauna/request',
    exact: true,
    name: 'Request Bar Item',
    element: RequestSaunaItem,
  },
  {
    path: '/booking/sauna/request/all',
    exact: true,
    name: 'All Bar Requests',
    element: AllSaunaRequest,
  },
]
