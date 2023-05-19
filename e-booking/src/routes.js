import { waiterRoutes } from './views/pages/Waiter/routes'
import { tableRoutes } from './views/pages/Tables/routes'
import { stockItemRoutes } from './views/pages/stockItems/routes'
import { stockRoutes } from './views/pages/stock/routes'
import { saunaRoutes } from './views/pages/Sauna/routes'
import { roomRoutes } from './views/pages/rooms/routes'
import { roomClassRoutes } from './views/pages/roomClass/routes'
import { reservationRoutes } from './views/pages/reservation/routes'
import { requestRoutes } from './views/pages/Requests/routes'
import { reportsRoutes } from './views/pages/Reports/routes'
import { productRoutes } from './views/pages/products/routes'
import { petitStockRoutes } from './views/pages/PetitStock/routes'
import { hallRoutes } from './views/pages/Hall/routes'
import { customerRoutes } from './views/pages/Customer/routes'
import { cashierRoutes } from './views/pages/Cashier/routes'
import { accountingRoutes } from './views/pages/Accounting/routes'
import { dashboardRoutes } from './views/dashboard/routes'
import { serviceRoutes } from './views/pages/services/routes'
import { userRoutes } from './views/pages/users/routes'
import { storeRoutes } from './views/pages/store/routes'
import { contractRoutes } from './views/pages/Contracts/routes'

const routes = [
  { path: '/', exact: true, name: 'Home' },
  ...dashboardRoutes,
  ...accountingRoutes,
  ...cashierRoutes,
  ...customerRoutes,
  ...hallRoutes,
  ...petitStockRoutes,
  ...productRoutes,
  ...reportsRoutes,
  ...requestRoutes,
  ...reservationRoutes,
  ...roomClassRoutes,
  ...roomRoutes,
  ...serviceRoutes,
  ...saunaRoutes,
  ...stockRoutes,
  ...stockItemRoutes,
  ...tableRoutes,
  ...waiterRoutes,
  ...userRoutes,
  ...storeRoutes,
  // ...contractRoutes,
]

export default routes
