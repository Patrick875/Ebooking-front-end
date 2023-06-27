const { CTableRow, CTableHeaderCell, CTableDataCell } = require('@coreui/react')

const Reservation = (props) => {
  const { reserv } = props
  console.log('single reserv', reserv)
  return (
    <CTableRow key={reserv.id}>
      <CTableHeaderCell scope="row">{reserv.Customer.names}</CTableHeaderCell>
      <CTableDataCell>
        {new Date(reserv.checkIn).toLocaleDateString()}
      </CTableDataCell>
      <CTableDataCell>
        {new Date(reserv.checkOut).toLocaleDateString()}
      </CTableDataCell>
      <CTableDataCell>
        {reserv.details ? (
          <div>
            {Object.keys(reserv.details).map((e) => (
              <p>
                {e} rooms : {reserv.details[e].people}
              </p>
            ))}
          </div>
        ) : (
          <p className="font-weight-bold">
            {reserv.Room
              ? 'Room : ' + reserv.Room.name
              : 'Hall : ' + reserv.Hall.name}
          </p>
        )}
      </CTableDataCell>
      <CTableDataCell>
        {new Date(reserv.createdAt).toLocaleDateString()}
      </CTableDataCell>
      <CTableDataCell>
        {' '}
        {reserv.status !== null ? reserv.status : 'active'}
      </CTableDataCell>
      <CTableDataCell>
        {Object.keys(reserv.amount).map((am, i) => (
          <p key={i}>
            {am} :{' '}
            {Number(Math.ceil(Number(reserv.amount[am]))).toLocaleString()}{' '}
          </p>
        ))}
      </CTableDataCell>
    </CTableRow>
  )
}

export default Reservation
