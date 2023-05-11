import React from 'react'
import CIcon from '@coreui/icons-react'
import { GiTakeMyMoney } from 'react-icons/gi'
import { AiFillDollarCircle } from 'react-icons/ai'
import { MdOutlineInsertDriveFile } from 'react-icons/md'
import {
  cilBook,
  cilHouse,
  cilPeople,
  cilSatelite,
  cilSave,
  cilSpeedometer,
  cilStorage,
  cilUser,
  cilFastfood,
  cilBasket,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'
import { DashboardNav } from './views/dashboard/nav'
import { CashierNav } from './views/pages/Cashier/nav'
import { CustomerNav } from './views/pages/Customer/nav'
import { HallNav } from './views/pages/Hall/nav'
import { PetitStockNav } from './views/pages/PetitStock/nav'
import { PackagesNav, ProductsNav } from './views/pages/products/nav'
import { AccountingNav } from './views/pages/Accounting/nav'
import { RoomClassNav } from './views/pages/roomClass/nav'
import { RoomNav } from './views/pages/rooms/nav'
import { ReceptionNav } from './views/pages/reservation/nav'
import { ServicesNav } from './views/pages/services/nav'
import { UsersNav } from './views/pages/users/nav'
import { StockItemNav } from './views/pages/stockItems/nav'
import { StockNav } from './views/pages/stock/nav'
const _nav = [
  DashboardNav,
  CashierNav,
  AccountingNav,
  RoomClassNav,
  RoomNav,
  HallNav,
  ReceptionNav,
  PetitStockNav,
  ProductsNav,
  PackagesNav,
  ServicesNav,
  UsersNav,
  StockItemNav,
  StockNav,
  CustomerNav,
]
export default _nav
