import StockItemAdd from './StockItemAdd'
import StockItems from './StockItems'
import UpdateStockItem from './UpdateStockItem'

export const stockItemRoutes = [
  {
    path: '/booking/stock/item/add',
    exact: true,
    name: 'Stock Items',
    element: StockItemAdd,
  },

  {
    path: '/booking/stock/items',
    exact: true,
    name: 'Stock Items',
    element: StockItems,
  },
  {
    path: '/booking/stock/items/update',
    exact: true,
    name: 'Stock Items',
    element: UpdateStockItem,
  },
]
