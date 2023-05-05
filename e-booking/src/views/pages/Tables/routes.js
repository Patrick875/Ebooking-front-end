import AllTables from './AllTables'
import CreateTable from './CreateTable'

export const tableRoutes = [
  {
    path: '/booking/tables/all',
    exact: true,
    name: 'All tables',
    element: AllTables,
  },
  {
    path: '/booking/tables/create',
    exact: true,
    name: 'Create table',
    element: CreateTable,
  },
]
