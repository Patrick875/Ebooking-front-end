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
function StockOrder(props, ref) {
  const { requestItems, removeItem } = props
  console.log('requests', requestItems)
  const [style, setStyle] = useState({ display: 'none' })

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h3>
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
                  requestItems.map((item, index) => {
                    return (
                      <CTableRow key={index + 1}>
                        <CTableHeaderCell scope="row">
                          {' '}
                          {index + 1}{' '}
                        </CTableHeaderCell>
                        <CTableDataCell> {item.name} </CTableDataCell>
                        <CTableDataCell>
                          {' '}
                          {item.quantity}{' '}
                          {item.quantity && item.quantity > 1
                            ? item.unit + 's'
                            : item.unit}{' '}
                        </CTableDataCell>
                        <CTableDataCell>
                          {' '}
                          {Number(item.price).toLocaleString()}{' '}
                        </CTableDataCell>
                        <CTableDataCell
                          onMouseEnter={(e) => {
                            setStyle({ display: 'block' })
                          }}
                          onMouseLeave={(e) => {
                            setStyle({ display: 'none' })
                          }}
                        >
                          {' '}
                          {Number(
                            Number(item.price) * Number(item.quantity),
                          ).toLocaleString()}{' '}
                          <CIcon icon={cilXCircle} size="sm" style={style} />
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })
                ) : (
                  <div className="text-center"> No items added</div>
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
