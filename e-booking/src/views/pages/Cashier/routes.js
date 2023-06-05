import AllCustomerBills from '../PetitStock/AllCustomerBiils'
import AllPosBills from '../PetitStock/AllPosBills'
import CashReport from './CashReport'
import CashTransaction from './CashTransaction'
import Sells from './Sells/Sells'
import SellsPending from './Sells/SellsPending'

export const cashierRoutes = [
  {
    path: '/booking/cashier/sells/pending',
    exact: true,
    name: 'Sells pending',
    element: SellsPending,
  },
  {
    path: '/booking/cashier/sells',
    exact: true,
    name: 'Cash in',
    element: Sells,
  },
  {
    path: '/booking/cashier/transaction',
    exact: true,
    name: 'Cash out',
    element: CashTransaction,
  },
  {
    path: '/booking/cashier/report',
    exact: true,
    name: 'Cash out',
    element: CashReport,
  },
  {
    path: '/cashier/customerbills',
    exact: true,
    name: 'Customer bills',
    element: AllCustomerBills,
  },
  {
    path: '/cashier/posbonbills',
    exact: true,
    name: 'Pos bon de commande bills',
    element: AllPosBills,
  },
]
