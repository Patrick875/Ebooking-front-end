import AllContracts from './AllContracts'
import CreateContract from './CreateContract'

export const contractRoutes = [
  {
    path: '/contract/new',
    exact: true,
    name: 'Create contract',
    element: CreateContract,
  },
  {
    path: '/contract/all',
    exact: true,
    name: 'All contracts',
    element: AllContracts,
  },
]
