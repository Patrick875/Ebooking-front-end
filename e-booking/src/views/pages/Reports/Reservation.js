import { displayCustomerName } from 'src/utils/functions'

const { CTableRow, CTableHeaderCell, CTableDataCell } = require('@coreui/react')

const Reservation = (props) => {
  const { reserv } = props

  return (
    <CTableRow key={reserv.id}>
      <CTableHeaderCell scope="row">
        {displayCustomerName(reserv.Customer)}
      </CTableHeaderCell>
      <CTableDataCell>
        {new Date(
          reserv.DatesIns.sort((a, b) => a.id - b.id)[0].datesIn.sort(
            (a, b) => new Date(a) - new Date(b),
          )[0],
        ).toLocaleDateString('fr-FR')}
      </CTableDataCell>
      <CTableDataCell>
        {new Date(
          reserv.DatesIns.sort((a, b) => b.id - a.id)[0].datesIn.sort(
            (a, b) => new Date(b) - new Date(a),
          )[0],
        ).toLocaleDateString('fr-FR')}
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
              : reserv.Hall
              ? 'Hall : ' + reserv.Hall.name
              : ''}
          </p>
        )}
      </CTableDataCell>
      <CTableDataCell>
        {new Date(reserv.createdAt).toLocaleDateString('fr-FR')}
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
      <CTableDataCell>
        {Object.keys(reserv.payment).map((am, i) => (
          <p key={i}>
            {Number(reserv.payment[am]).toLocaleString()} {am}
          </p>
        ))}
      </CTableDataCell>
    </CTableRow>
  )
}

export default Reservation
