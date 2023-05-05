import Hall from './Hall'
import HallAdd from './HallAdd'
import HallEdit from './HallEdit'
import HallInfo from './HallInfo'
import HallServicesAdd from './HallServicesAdd'
import HallServicesEdit from './HallServicesEdit'
import HallServices from './HallServices'

export const hallRoutes = [
  {
    path: 'booking/halls/',
    exact: true,
    name: 'Hall',
    element: Hall,
  },
  {
    path: 'booking/halls/add',
    exact: true,
    name: 'Add Hall',
    element: HallAdd,
  },
  {
    path: 'booking/halls/edit',
    exact: true,
    name: 'Edit Hall',
    element: HallEdit,
  },
  {
    path: 'booking/halls/info',
    exact: true,
    name: 'View Hall',
    element: HallInfo,
  },
  {
    path: 'booking/halls/services/add',
    exact: true,
    name: 'Add Hall services',
    element: HallServicesAdd,
  },
  {
    path: 'booking/halls/services/edit',
    exact: true,
    name: 'Edit Hall service',
    element: HallServicesEdit,
  },
  {
    path: 'booking/halls/services',
    exact: true,
    name: 'Hall services',
    element: HallServices,
  },
]
