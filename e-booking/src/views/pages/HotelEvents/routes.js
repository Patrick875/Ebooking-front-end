import CreateHotelEvent from './CreateHotelEvent'
import HotelEventView from './HotelEventView'
import HotelEvents from './HotelEvents'

export const hotelEventRoutes = [
  {
    path: 'booking/events/',
    exact: true,
    name: 'All Events',
    element: HotelEvents,
  },
  {
    path: 'booking/events/add',
    exact: true,
    name: 'Create Event',
    element: CreateHotelEvent,
  },

  {
    path: 'booking/events/view',
    exact: true,
    name: 'View Hotel Event',
    element: HotelEventView,
  },
]
