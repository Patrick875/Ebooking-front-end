import AllCustomerBills from '../PetitStock/AllCustomerBiils'
import AllPosBills from '../PetitStock/AllPosBills'
import ViewCustomerBill from '../PetitStock/ViewCustomerBill'
import ViewPosBill from '../PetitStock/ViewPosBill'
import CashReport from './CashReport'
import CashTransaction from './CashTransaction'
import AllVauchers from './CashierVaucher/AllVauchers'
import CreateCashierVaucher from './CashierVaucher/CreateCashierVaucher'
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
  {
    path: '/cashier/posbonbills/view',
    exact: true,
    name: 'Pos bon de commande bill view',
    element: ViewPosBill,
  },
  {
    path: '/cashier/customerbills/view',
    exact: true,
    name: 'Customer bill view',
    element: ViewCustomerBill,
  },

  {
    path: '/booking/cashier/vauchers',
    exact: true,
    name: 'Cash Vaucher ',
    element: AllVauchers,
  },
  {
    name: 'Cash Vaucher Create',
    exact: true,
    path: '/booking/cashier/vauchers/create',
    element: CreateCashierVaucher,
  },
]
