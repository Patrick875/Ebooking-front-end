import StockItemAdd from './StockItemAdd'
import StockItems from './StockItems'
import UpdateStockItem from './UpdateStockItem'
import UpdateStockItemValue from './UpdateStockItemValue'

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
  {
    path: '/booking/stock/items/value-update',
    exact: true,
    name: 'Stock Item Value',
    element: UpdateStockItemValue,
  },
]
