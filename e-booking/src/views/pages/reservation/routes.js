import ReservationAdd from './ReservationAdd'
import ReservationView from './ReservationView'
import Reservations from './Reservations'
import CreateDailySalesReport from './Daily Sales/CreateDailySalesReport'
import AllDailySalesReports from './Daily Sales/AllDailySalesReports'
import DailySalesReportView from './Daily Sales/DailySalesReportView'
import CheckinOut from './CheckinOut'

export const reservationRoutes = [
  {
    path: '/booking/reservations/add',
    exact: true,
    name: 'Book new room',
    element: ReservationAdd,
  },
  {
    path: '/booking/reservations/check-in',
    exact: true,
    name: 'Book new room',
    element: CheckinOut,
  },
  {
    path: '/booking/reservations/info',
    exact: true,
    name: 'View reservation',
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
]
