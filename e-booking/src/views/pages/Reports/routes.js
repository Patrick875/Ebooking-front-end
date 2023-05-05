import ReservationReports from './ReservationReports'

export const reportsRoutes = [
  {
    path: '/reports/reservations',
    exact: true,
    name: 'Reservation reports',
    element: ReservationReports,
  },
]
