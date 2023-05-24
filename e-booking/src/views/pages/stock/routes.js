import AddStock from './AddStock'
import AvailableStock from './AvailableStock'
import ReceiveVouchers from './ReceiveVouchers'
import StockRequests from './StockRequests'
import StockRequestView from './StockRequestView'
import ReceiveVaucherView from './ReceiveVaucherView'
import StockReport from './StockReport'
import StockItemTrack from './StockItemTrack'
import AllPurchaseOrders from './AllPurchaseOrders'
import PurchaseOrderView from './PurchaseOrderView'

export const stockRoutes = [
  {
    path: '/booking/stock/add',
    exact: true,
    name: 'Add Stock ',
    element: AddStock,
  },
  {
    path: '/booking/stock/report',
    exact: true,
    name: 'Stock report ',
    element: StockReport,
  },
  {
    path: '/booking/stock/item/history',
    exact: true,
    name: 'Item tracking ',
    element: StockItemTrack,
  },
  {
    path: '/booking/stock/available',
    exact: true,
    name: 'Availabe Stock',
    element: AvailableStock,
  },
  {
    path: '/booking/stock/received',
    exact: true,
    name: 'Receive vauchers',
    element: ReceiveVouchers,
  },
  {
    path: '/booking/stock/request/out',
    exact: true,
    name: 'Out Stock requests',
    element: StockRequests,
  },
  {
    path: '/booking/stock/request/out/view',
    exact: true,
    name: 'Stock request',
    element: StockRequestView,
  },
  {
    path: '/booking/stock/received/view',
    exact: true,
    name: 'Stock Items',
    element: ReceiveVaucherView,
  },
  {
    path: '/booking/stock/purchaseOrders',
    exact: true,
    name: 'Purchase orders',
    element: AllPurchaseOrders,
  },
  {
    path: '/booking/stock/purchaseOrder/view',
    exact: true,
    name: 'View Purchase order',
    element: PurchaseOrderView,
  },
]
