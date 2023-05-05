import React from 'react'
import UserRolesAdd from './views/pages/users/UserRolesAdd'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const WaiterSells = React.lazy(() => import('./views/pages/Waiter/WaiterSells'))
// custom pages

//roomClass
const addRoomClass = React.lazy(() =>
  import('./views/pages/roomClass/RoomClassAdd'),
)
const RoomClasses = React.lazy(() =>
  import('./views/pages/roomClass/RoomClasses'),
)
const RoomClassEdit = React.lazy(() =>
  import('./views/pages/roomClass/RoomClassEdit.js'),
)

//roomms
const addRoom = React.lazy(() => import('./views/pages/rooms/roomAdd'))
const roomsAvailable = React.lazy(() => import('./views/pages/rooms/Room'))
const occupiedRooms = React.lazy(() => import('./views/pages/rooms/Occupied'))
//const RoomSell = React.lazy(() => import('./views/pages/rooms/RoomSell'))
//Halls

const Hall = React.lazy(() => import('./views/pages/Hall/Hall'))
const HallAdd = React.lazy(() => import('./views/pages/Hall/HallAdd'))
const HallEdit = React.lazy(() => import('./views/pages/Hall/HallEdit'))
const HallInfo = React.lazy(() => import('./views/pages/Hall/HallInfo.js'))
const HallServicesAdd = React.lazy(() =>
  import('./views/pages/Hall/HallServicesAdd.js'),
)
const HallServicesEdit = React.lazy(() =>
  import('./views/pages/Hall/HallServicesEdit.js'),
)
const HallServices = React.lazy(() =>
  import('./views/pages/Hall/HallServices.js'),
)

const ReservationAdd = React.lazy(() =>
  import('./views/pages/reservation/ReservationAdd'),
)
const Reservations = React.lazy(() =>
  import('./views/pages/reservation/Reservations'),
)

const ReservationView = React.lazy(() =>
  import('./views/pages/reservation/ReservationView'),
)

//daily sales

const CreateDailySalesReport = React.lazy(() =>
  import('./views/pages/reservation/Daily Sales/CreateDailySalesReport'),
)
const AllDailySalesReports = React.lazy(() =>
  import('./views/pages/reservation/Daily Sales/AllDailySalesReports'),
)
const DailySalesReportView = React.lazy(() =>
  import('./views/pages/reservation/Daily Sales/DailySalesReportView'),
)

//users

const Users = React.lazy(() => import('./views/pages/users/Users'))
const UserAdd = React.lazy(() => import('./views/pages/users/UserAdd'))
const UserEdit = React.lazy(() => import('./views/pages/users/UserEdit'))
const UserRoles = React.lazy(() => import('./views/pages/users/UserRoles'))

const UserRolesEdit = React.lazy(() =>
  import('./views/pages/users/UserRolesEdit'),
)

const ChangePassword = React.lazy(() =>
  import('./views/pages/users/ChangePassword.js'),
)
//Bar

const CreatePetitStock = React.lazy(() =>
  import('./views/pages/PetitStock/CreatePetitStock'),
)
const AllPetitStock = React.lazy(() =>
  import('./views/pages/PetitStock/AllPetitStock'),
)
const CreateTable = React.lazy(() => import('./views/pages/Tables/CreateTable'))
const AllTables = React.lazy(() => import('./views/pages/Tables/AllTables'))
const AllBarItems = React.lazy(() =>
  import('./views/pages/PetitStock/AllBarItems'),
)
const RequestBarItem = React.lazy(() =>
  import('./views/pages/PetitStock/RequestBarItem'),
)
const AllBarRequest = React.lazy(() =>
  import('./views/pages/PetitStock/AllBarRequest'),
)
const BarSells = React.lazy(() => import('./views/pages/PetitStock/BarSells'))

//sauna
const AllSaunaItems = React.lazy(() =>
  import('./views/pages/Sauna/AllSaunaItems'),
)
const RequestSaunaItem = React.lazy(() =>
  import('./views/pages/Sauna/RequestSaunaItem'),
)
const AddSaunaItem = React.lazy(() =>
  import('./views/pages/Sauna/AddSaunaItem'),
)
const AllSaunaRequest = React.lazy(() =>
  import('./views/pages/Sauna/AllSaunaRequest'),
)

// products
const ProductEdit = React.lazy(() =>
  import('./views/pages/products/ProductEdit'),
)
const ProductSell = React.lazy(() =>
  import('./views/pages/products/ProductSell'),
)
const ProductSells = React.lazy(() =>
  import('./views/pages/products/ProductSells'),
)

const ProductsAdd = React.lazy(() =>
  import('./views/pages/products/ProductsAdd'),
)
const Products = React.lazy(() => import('./views/pages/products/Products'))

//product categories

const ProductCategoryAdd = React.lazy(() =>
  import('./views/pages/products/ProductCategoryAdd'),
)
const ProductCategories = React.lazy(() =>
  import('./views/pages/products/ProductCategories'),
)

//product packages

const ProductPackages = React.lazy(() =>
  import('./views/pages/products/ProductPackages'),
)
const ProductPackageAdd = React.lazy(() =>
  import('./views/pages/products/ProductPackageAdd'),
)

// services

const ServiceCategories = React.lazy(() =>
  import('./views/pages/services/ServiceCategories'),
)
const ServiceCategoryAdd = React.lazy(() =>
  import('./views/pages/services/ServiceCategoryAdd'),
)
const ServicesAdd = React.lazy(() =>
  import('./views/pages/services/ServicesAdd'),
)
const Services = React.lazy(() => import('./views/pages/services/Services'))
const ServiceSell = React.lazy(() =>
  import('./views/pages/services/ServiceSell'),
)
const ServiceEdit = React.lazy(() =>
  import('./views/pages/services/ServiceEdit.js'),
)

const Invoice = React.lazy(() =>
  import('./views/pages/Accounting/Invoice/Invoice'),
)
const CreateInvoice = React.lazy(() =>
  import('./views/pages/Accounting/Invoice/CreateInvoice'),
)
const ViewInvoice = React.lazy(() =>
  import('./views/pages/Accounting/Invoice/ViewInvoice'),
)
const ProformaInvoice = React.lazy(() =>
  import('./views/pages/Accounting/ProFormaInvoice/ProformaInvoice'),
)
const CreateProformaInvoice = React.lazy(() =>
  import('./views/pages/Accounting/ProFormaInvoice/CreateProformaInvoice'),
)
const ViewProFormaInvoice = React.lazy(() =>
  import('./views/pages/Accounting/ProFormaInvoice/ViewProFormaInvoice'),
)
const DeliveryNote = React.lazy(() =>
  import('./views/pages/Accounting/DeliveryNote/DeliveryNote'),
)
const CreateDeliveryNote = React.lazy(() =>
  import('./views/pages/Accounting/DeliveryNote/CreateDeliveryNote'),
)
const ViewDeliveryNote = React.lazy(() =>
  import('./views/pages/Accounting/DeliveryNote/ViewDeliveryNote'),
)
const BaudDeCommande = React.lazy(() =>
  import('./views/pages/Accounting/BonDeCommande/BaudDeCommande.js'),
)
const CreateBaudDeCommande = React.lazy(() =>
  import('./views/pages/Accounting/BonDeCommande/CreateBaudDeCommande.js'),
)
const ViewBonDeCommande = React.lazy(() =>
  import('./views/pages/Accounting/BonDeCommande/ViewBonDeCommande.js'),
)

const CashTransaction = React.lazy(() =>
  import('./views/pages/Cashier/CashTransaction'),
)
const CashReport = React.lazy(() => import('./views/pages/Cashier/CashReport'))
const SellsPending = React.lazy(() =>
  import('./views/pages/Cashier/Sells/SellsPending'),
)
const Sells = React.lazy(() => import('./views/pages/Cashier/Sells/Sells'))

//requests
const RequestToCashier = React.lazy(() =>
  import('./views/pages/Requests/RequestToCashier'),
)

const AllRequestToCashier = React.lazy(() =>
  import('./views/pages/Requests/AllRequestToCashier'),
)
const ViewRequestToCashier = React.lazy(() =>
  import('./views/pages/Requests/ViewRequestToCashier'),
)
//stock

const AddStock = React.lazy(() => import('./views/pages/stock/AddStock'))
const ReceiveVouchers = React.lazy(() =>
  import('./views/pages/stock/ReceiveVouchers'),
)
const ReceiveVaucherView = React.lazy(() =>
  import('./views/pages/stock/ReceiveVaucherView'),
)
const AvailableStock = React.lazy(() =>
  import('./views/pages/stock/AvailableStock'),
)
const StockRequests = React.lazy(() =>
  import('./views/pages/stock/StockRequests'),
)

const StockRequestView = React.lazy(() =>
  import('./views/pages/stock/StockRequestView'),
)
// stock-item
const StockItemAdd = React.lazy(() =>
  import('./views/pages/stockItems/StockItemAdd'),
)
const StockItems = React.lazy(() =>
  import('./views/pages/stockItems/StockItems'),
)
// customers

const Customers = React.lazy(() => import('./views/pages/Customer/Customers'))
const CustomerAdd = React.lazy(() =>
  import('./views/pages/Customer/CustomerAdd'),
)
const CustomerView = React.lazy(() =>
  import('./views/pages/Customer/CustomerView'),
)
const CustomerEdit = React.lazy(() =>
  import('./views/pages/Customer/CustomerEdit'),
)

//reports

const CreateReport = React.lazy(() =>
  import('./views/pages/Reports/CreateReport.js'),
)
const DaySalesReport = React.lazy(() =>
  import('./views/pages/Reports/DaySalesReport'),
)

const PetitStockReports = React.lazy(() =>
  import('./views/pages/Reports/PetitStockReports.js'),
)
const CashierReports = React.lazy(() =>
  import('./views/pages/Reports/CashierReports.js'),
)
const ReservationReports = React.lazy(() =>
  import('./views/pages/Reports/ReservationReports.js'),
)
const StockReports = React.lazy(() =>
  import('./views/pages/Reports/StockReports.js'),
)
// const StockAdd = React.lazy(() => import('./views/pages/services/ServicesAdd'))
// const AvailableStock = React.lazy(() => import('./views/pages/services/Services'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/mysells', name: 'Waiter sells', element: WaiterSells },
  {
    path: 'booking/rooms/class/add',
    exact: true,
    name: 'Add room class',
    element: addRoomClass,
  },
  {
    path: 'booking/rooms/class/all',
    exact: true,
    name: 'All room class',
    element: RoomClasses,
  },
  {
    path: 'booking/rooms/class/edit',
    exact: true,
    name: 'All room class',
    element: RoomClassEdit,
  },
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
    name: 'Add Hall products',
    element: HallServicesAdd,
  },
  {
    path: 'booking/halls/services/edit',
    exact: true,
    name: 'Add Hall products',
    element: HallServicesEdit,
  },
  {
    path: 'booking/halls/services',
    exact: true,
    name: 'Hall services',
    element: HallServices,
  },

  {
    path: '/booking/rooms/add',
    exact: true,
    name: 'Add room',
    element: addRoom,
  },

  {
    path: '/booking/rooms/update',
    exact: true,
    name: 'Sell room',
    element: addRoom,
  },
  {
    path: '/booking/reservations/add',
    exact: true,
    name: 'Book new room',
    element: ReservationAdd,
  },
  {
    path: '/booking/reservations/info',
    exact: true,
    name: 'Book new room',
    element: ReservationView,
  },
  {
    path: '/booking/reservations/all',
    exact: true,
    name: 'All Reservation',
    element: Reservations,
  },
  {
    path: '/reports/receiption/create',
    exact: true,
    name: 'Create Daily Sales report',
    element: CreateDailySalesReport,
  },
  {
    path: '/reports/receiption/all',
    exact: true,
    name: 'All Daily Sales reports',
    element: AllDailySalesReports,
  },
  {
    path: '/reports/receiption/view',
    exact: true,
    name: 'Daily sales report view',
    element: DailySalesReportView,
  },
  {
    path: '/booking/rooms/available',
    exact: true,
    name: 'Free rooms',
    keyword: 'available',
    element: roomsAvailable,
  },
  {
    path: '/booking/rooms/available/book',
    exact: true,
    name: 'Free rooms',
    keyword: 'available',
    element: Reservations,
  },
  {
    path: '/booking/rooms/occupied',
    exact: true,
    name: 'Occupaied rooms',
    keyword: 'occupied',
    element: occupiedRooms,
  },
  {
    path: '/booking/user/add',
    exact: true,
    name: 'Add user',
    element: UserAdd,
  },
  {
    path: '/booking/user/edit',
    exact: true,
    name: 'Edit user',
    element: UserEdit,
  },
  {
    path: '/booking/user/roles',
    exact: true,
    name: 'Edit user',
    element: UserRoles,
  },
  {
    path: '/booking/user/roles/add',
    exact: true,
    name: 'Add user Role',
    element: UserRolesAdd,
  },
  {
    path: '/booking/user/roles/edit',
    exact: true,
    name: 'Edit user Role',
    element: UserRolesEdit,
  },
  {
    path: '/password',
    exact: true,
    name: 'Change Password',
    element: ChangePassword,
  },
  { path: '/booking/users', exact: true, name: 'User', element: Users },
  {
    path: '/booking/petitstock/all',
    exact: true,
    name: 'All petit stocks',
    element: AllPetitStock,
  },
  {
    path: '/booking/petitstock/create',
    exact: true,
    name: 'Create petit stock',
    element: CreatePetitStock,
  },
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

  {
    path: '/booking/petitstock/items/all',
    exact: true,
    name: 'All Petit stock items',
    element: AllBarItems,
  },
  {
    path: '/booking/petitstock/request',
    exact: true,
    name: 'Request petit stock Item',
    element: RequestBarItem,
  },
  {
    path: '/booking/petit/request/all',
    exact: true,
    name: 'All petit Requests',
    element: AllBarRequest,
  },
  {
    path: '/booking/bar/sells',
    exact: true,
    name: 'Bar sells',
    element: BarSells,
  },
  {
    path: '/booking/sauna/add',
    exact: true,
    name: 'Add Bar Item',
    element: AddSaunaItem,
  },
  {
    path: '/booking/sauna/all',
    exact: true,
    name: 'All Bar items',
    element: AllSaunaItems,
  },
  {
    path: '/booking/sauna/request',
    exact: true,
    name: 'Request Bar Item',
    element: RequestSaunaItem,
  },
  {
    path: '/booking/sauna/request/all',
    exact: true,
    name: 'All Bar Requests',
    element: AllSaunaRequest,
  },
  {
    path: '/booking/products/sell',
    exact: true,
    name: 'Product',
    element: ProductSell,
  },
  {
    path: '/booking/products/sell/all',
    exact: true,
    name: 'Product',
    element: ProductSells,
  },
  {
    path: '/booking/products/add',
    exact: true,
    name: ' Add Product',
    element: ProductsAdd,
  },
  {
    path: '/booking/products/edit',
    exact: true,
    name: 'Product',
    element: ProductEdit,
  },

  {
    path: '/booking/products/all',
    exact: true,
    name: 'Product',
    element: Products,
  },
  {
    path: '/booking/products/categories/add',
    exact: true,
    name: 'Product',
    element: ProductCategoryAdd,
  },
  {
    path: '/booking/products/categories/all',
    exact: true,
    name: 'Product',
    element: ProductCategories,
  },
  {
    path: '/booking/products/packages/all',
    exact: true,
    name: 'Product',
    element: ProductPackages,
  },
  {
    path: '/booking/products/packages/add',
    exact: true,
    name: 'Product',
    element: ProductPackageAdd,
  },
  {
    path: '/booking/services/category/add',
    exact: true,
    name: 'Create Service Category',
    element: ServiceCategoryAdd,
  },
  {
    path: '/booking/services/category/all',
    exact: true,
    name: 'All Service Categories',
    element: ServiceCategories,
  },
  {
    path: '/booking/services/sell',
    exact: true,
    name: 'Service',
    element: ServiceSell,
  },
  {
    path: '/booking/services/add',
    exact: true,
    name: 'Service',
    element: ServicesAdd,
  },
  {
    path: '/booking/services/edit',
    exact: true,
    name: 'Service',
    element: ServiceEdit,
  },
  {
    path: '/booking/services/all',
    exact: true,
    name: 'Service',
    element: Services,
  },
  {
    path: '/booking/accounting/proformainvoice',
    exact: true,
    name: 'Pro forma invoice',
    element: ProformaInvoice,
  },
  {
    path: '/booking/accounting/proformainvoice/create',
    exact: true,
    name: 'Create Pro forma invoice',
    element: CreateProformaInvoice,
  },
  {
    path: '/booking/accounting/proformainvoice/view',
    exact: true,
    name: 'Create Pro forma invoice',
    element: ViewProFormaInvoice,
  },
  {
    path: '/booking/accounting/invoice',
    exact: true,
    name: 'Invoice',
    element: Invoice,
  },
  {
    path: '/booking/accounting/invoice/create',
    exact: true,
    name: 'Create invoice',
    element: CreateInvoice,
  },
  {
    path: '/booking/accounting/invoice/view',
    exact: true,
    name: 'Create invoice',
    element: ViewInvoice,
  },
  {
    path: '/booking/accounting/delivery',
    exact: true,
    name: 'Invoice',
    element: DeliveryNote,
  },
  {
    path: '/booking/accounting/delivery/create',
    exact: true,
    name: 'Create invoice',
    element: CreateDeliveryNote,
  },
  {
    path: '/booking/accounting/delivery/view',
    exact: true,
    name: 'Create invoice',
    element: ViewDeliveryNote,
  },
  {
    path: '/booking/accounting/bon-de-commande',
    exact: true,
    name: 'Bon de commande',
    element: BaudDeCommande,
  },
  {
    path: '/booking/accounting/bon-de-commande/create',
    exact: true,
    name: 'Create baud de commancde',
    element: CreateBaudDeCommande,
  },
  {
    path: '/booking/accounting/bon-de-commande/view',
    exact: true,
    name: 'Create baud de commancde',
    element: ViewBonDeCommande,
  },
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
    path: '/booking/stock/add',
    exact: true,
    name: 'Add Stock ',
    element: AddStock,
  },
  {
    path: '/booking/stock/available',
    exact: true,
    name: 'Availabe Stock',
    element: AvailableStock,
  },
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
    path: '/booking/requests/cashier',
    exact: true,
    name: 'Cashier request',
    element: RequestToCashier,
  },
  {
    path: '/booking/requests/cashier/all',
    exact: true,
    name: 'All Cashier request',
    element: AllRequestToCashier,
  },
  {
    path: '/booking/requests/cashier/view',
    exact: true,
    name: 'View Request To Cashier',
    element: ViewRequestToCashier,
  },

  {
    path: '/customers',
    exact: true,
    name: 'All customers',
    element: Customers,
  },
  {
    path: '/customers/add',
    exact: true,
    name: 'Add customer',
    element: CustomerAdd,
  },
  {
    path: '/customers/info',
    exact: true,
    name: 'View customer',
    element: CustomerView,
  },
  {
    path: '/customers/edit',
    exact: true,
    name: 'Edit customer',
    element: CustomerEdit,
  },
  {
    path: '/reports/create',
    exact: true,
    name: 'Add report',
    element: CreateReport,
  },
  {
    path: '/reports/create/daysales',
    exact: true,
    name: 'Add Day Sales Report',
    element: DaySalesReport,
  },
  {
    path: '/reports/cashier',
    exact: true,
    name: 'Cashier reports',
    element: CashierReports,
  },
  {
    path: '/reports/reservations',
    exact: true,
    name: 'Cashier reports',
    element: ReservationReports,
  },
  {
    path: '/reports/petit-stock',
    exact: true,
    name: 'Petit stock reports',
    element: PetitStockReports,
  },
  {
    path: '/reports/stock',
    exact: true,
    name: 'Stock reports',
    element: StockReports,
  },
]

export default routes
