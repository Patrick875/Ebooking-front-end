const {
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
} = require('@coreui/react')
const {
  getUTCDateWithoutHours,
  searchReservByCustomerName,
} = require('src/utils/functions')
const { default: Reservation } = require('./Reservation')

const ReservationsTable = (props) => {
  let { reservations, query } = props
  const { filter_condition, filter_condition2, time, myDates } = props
  reservations = reservations && reservations.length !== 0 ? reservations : []
  let totalPayments = 0
  let totalAmount = 0

  if (reservations.length !== 0) {
    if (filter_condition === 'All' && filter_condition2 === 'All') {
      if (time && time === 'all-time') {
        totalAmount = reservations.reduce(
          (acc, b) => acc + Math.ceil(Number(b.amount['RWF'])),
          0,
        )
        totalPayments = reservations.reduce(
          (acc, b) => acc + Math.ceil(Number(b.payment['RWF'])),
          0,
        )
      } else if (myDates && myDates.length !== 0) {
        reservations = reservations.filter((reserv) =>
          myDates.includes(
            getUTCDateWithoutHours(reserv.createdAt) ? reserv : null,
          ),
        )
        totalAmount = reservations.reduce(
          (acc, b) => acc + Math.ceil(Number(b.amount['RWF'])),
          0,
        )
        totalPayments = reservations.reduce(
          (acc, b) => acc + Math.ceil(Number(b.payment['RWF'])),
          0,
        )
      }
    } else if (filter_condition2 === 'All' && filter_condition !== 'All') {
      if (time && time === 'all-time') {
        reservations = reservations.filter((reserv) =>
          reserv.status === filter_condition ? reserv : null,
        )
        totalAmount = reservations.reduce(
          (acc, b) => acc + Math.ceil(Number(b.amount['RWF'])),
          0,
        )
        totalPayments = reservations.reduce(
          (acc, b) => acc + Math.ceil(Number(b.payment['RWF'])),
          0,
        )
      } else if (myDates && myDates.length !== 0) {
        reservations = reservations.filter((reserv) =>
          myDates.includes(
            getUTCDateWithoutHours(reserv.createdAt) &&
              reserv.status === filter_condition
              ? reserv
              : null,
          ),
        )
        totalAmount = reservations.reduce(
          (acc, b) => acc + Math.ceil(Number(b.amount['RWF'])),
          0,
        )
        totalPayments = reservations.reduce(
          (acc, b) => acc + Math.ceil(Number(b.payment['RWF'])),
          0,
        )
      }
    } else if (filter_condition2 === 'room') {
      if (time && time === 'all-time') {
        reservations = reservations.filter((reserv) =>
          (reserv.status === filter_condition || filter_condition === 'All') &&
          reserv.roomId
            ? reserv
            : null,
        )
        totalAmount = reservations.reduce(
          (acc, b) => acc + Math.ceil(Number(b.amount['RWF'])),
          0,
        )
        totalPayments = reservations.reduce(
          (acc, b) => acc + Math.ceil(Number(b.payment['RWF'])),
          0,
        )
      } else if (myDates && myDates.length !== 0) {
        reservations = reservations.filter((reserv) =>
          myDates.includes(getUTCDateWithoutHours(reserv.createdAt)) &&
          (reserv.status === filter_condition || filter_condition === 'All') &&
          reserv.roomId
            ? reserv
            : null,
        )
        totalAmount = reservations.reduce(
          (acc, b) => acc + Math.ceil(Number(b.amount['RWF'])),
          0,
        )
        totalPayments = reservations.reduce(
          (acc, b) => acc + Math.ceil(Number(b.payment['RWF'])),
          0,
        )
      }
    } else {
      if (time && time === 'all-time') {
        reservations = reservations.filter((reserv) =>
          (reserv.status === filter_condition || filter_condition === 'All') &&
          reserv.hallId
            ? reserv
            : null,
        )
        totalAmount = reservations.reduce(
          (acc, b) => acc + Math.ceil(Number(b.amount['RWF'])),
          0,
        )
        totalPayments = reservations.reduce(
          (acc, b) => acc + Math.ceil(Number(b.payment['RWF'])),
          0,
        )
      } else if (myDates && myDates.length !== 0) {
        reservations = reservations.filter((reserv) =>
          myDates.includes(getUTCDateWithoutHours(reserv.createdAt)) &&
          (reserv.status === filter_condition || filter_condition === 'All') &&
          reserv.hallId
            ? reserv
            : null,
        )
        totalAmount = reservations.reduce(
          (acc, b) => acc + Math.ceil(Number(b.amount['RWF'])),
          0,
        )
        totalPayments = reservations.reduce(
          (acc, b) => acc + Math.ceil(Number(b.payment['RWF'])),
          0,
        )
      }
    }

    reservations =
      query && query !== ''
        ? searchReservByCustomerName(reservations, query)
        : reservations

    if (query && query !== 0) {
      totalAmount = reservations.reduce(
        (acc, b) => acc + Math.ceil(Number(b.amount['RWF'])),
        0,
      )
      totalPayments = reservations.reduce(
        (acc, b) => acc + Math.ceil(Number(b.payment['RWF'])),
        0,
      )
    }
  }

  return (
    <CCardBody>
      <CTable bordered>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Names</CTableHeaderCell>
            <CTableHeaderCell scope="col"> Check In </CTableHeaderCell>
            <CTableHeaderCell scope="col"> Check Out</CTableHeaderCell>
            <CTableHeaderCell scope="col"> Room/Hall </CTableHeaderCell>
            <CTableHeaderCell scope="col"> Booked On </CTableHeaderCell>
            <CTableHeaderCell scope="col"> Status </CTableHeaderCell>
            <CTableHeaderCell scope="col"> Amount </CTableHeaderCell>
            <CTableHeaderCell scope="col"> Paid </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {reservations && reservations.length !== 0 ? (
            reservations.map((reserv) => <Reservation reserv={reserv} />)
          ) : (
            <p></p>
          )}
          <CTableRow>
            <CTableHeaderCell scope="row" colSpan={7}>
              Total Amount (RWF)
            </CTableHeaderCell>
            <CTableHeaderCell>{totalAmount.toLocaleString()}</CTableHeaderCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row" colSpan={7}>
              Total Paid (RWF){' '}
            </CTableHeaderCell>
            <CTableHeaderCell>
              {totalPayments.toLocaleString()}
            </CTableHeaderCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </CCardBody>
  )
}

export default ReservationsTable
