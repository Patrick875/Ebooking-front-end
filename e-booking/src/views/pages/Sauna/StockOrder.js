import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilXCircle } from '@coreui/icons'
function StockOrder(props) {
  const { requestItems, setRequestItems } = props
  const [style, setStyle] = useState({ display: 'none' })
  const purchaseTotal =
    requestItems && requestItems.length !== 0
      ? requestItems
          .reduce((acc, b) => acc + Number(b.quantity) * Number(b.price), 0)
          .toLocaleString()
      : 0
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h3 className="text-center">
              <strong> Stock order </strong>
            </h3>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Item </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Qty </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Price/unit </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Total </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {requestItems && requestItems.length !== 0 ? (
                  <React.Fragment>
                    {requestItems.map((item, index) => {
                      return (
                        <CTableRow key={index + 1}>
                          <CTableHeaderCell scope="row">
                            {' '}
                            {index + 1}{' '}
                          </CTableHeaderCell>
                          <CTableDataCell> {item.name} </CTableDataCell>
                          <CTableDataCell>
                            {' '}
                            {item.quantity} {item.unit}{' '}
                          </CTableDataCell>
                          <CTableDataCell> {item.price} </CTableDataCell>
                          <CTableDataCell
                            onMouseEnter={(e) => {
                              setStyle({ display: 'block' })
                            }}
                            onMouseLeave={(e) => {
                              setStyle({ display: 'none' })
                            }}
                          >
                            {' '}
                            {Number(item.price) * Number(item.quantity)}{' '}
                            <CIcon icon={cilXCircle} size="sm" style={style} />
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                    <CTableRow>
                      <CTableHeaderCell colSpan={4}>Total</CTableHeaderCell>
                      <CTableDataCell>{purchaseTotal}</CTableDataCell>
                    </CTableRow>
                  </React.Fragment>
                ) : (
                  <CTableRow>No items added</CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default StockOrder
