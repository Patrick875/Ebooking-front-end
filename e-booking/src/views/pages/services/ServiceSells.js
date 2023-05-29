import {
  CCardBody,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

function ServiceSells(props) {
  const { sells } = props
  console.log('service category sells', sells)
  return (
    <div>
      <CCardBody>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Service</CTableHeaderCell>
              <CTableHeaderCell scope="col">times</CTableHeaderCell>
              <CTableHeaderCell scope="col">Client</CTableHeaderCell>
              <CTableHeaderCell scope="col">Seller</CTableHeaderCell>
              <CTableHeaderCell scope="col">Total</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {sells && sells.length !== 0
              ? sells.slice(0, 10).map((item, i) => {
                  return (
                    <CTableRow key={item.id}>
                      <CTableHeaderCell scope="row">{1 + i}</CTableHeaderCell>
                      <CTableDataCell>{item.Service.name}</CTableDataCell>
                      <CTableDataCell>
                        {Number(item.total / item.Service.price)}
                      </CTableDataCell>

                      <CTableDataCell>{item.client_name}</CTableDataCell>
                      <CTableDataCell>
                        {item.User.firstName + ' ' + item.User.lastName}
                      </CTableDataCell>
                      <CTableDataCell>
                        {Number(item.total).toLocaleString()}
                      </CTableDataCell>
                    </CTableRow>
                  )
                })
              : null}
          </CTableBody>
        </CTable>
      </CCardBody>
    </div>
  )
}

export default ServiceSells
