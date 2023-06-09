import {
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
function PurchaseOrder(props, ref) {
  const { requestItems, setRequestItems } = props
  const [style, setStyle] = useState({ display: 'none' })
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h3>
              <strong> Purchase order </strong>
            </h3>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Item </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Prev.Qty </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Qty </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Price/unit </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Total </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {requestItems && requestItems.length !== 0 ? (
                  requestItems.map((added, index) => {
                    return (
                      <CTableRow key={index + 1}>
                        <CTableHeaderCell scope="row">
                          {' '}
                          {index + 1}{' '}
                        </CTableHeaderCell>
                        <CTableDataCell>
                          {' '}
                          {added.itemName || added.name}{' '}
                        </CTableDataCell>
                        <CTableDataCell>
                          {added.prevQ} {added.unit}
                        </CTableDataCell>
                        <CTableDataCell>
                          {' '}
                          {added.quantity} {added.unit}{' '}
                        </CTableDataCell>
                        <CTableDataCell> {added.price} </CTableDataCell>
                        <CTableDataCell
                          onMouseEnter={(e) => {
                            setStyle({ display: 'block' })
                          }}
                          onMouseLeave={(e) => {
                            setStyle({ display: 'none' })
                          }}
                          className="d-flex  gap-2"
                        >
                          {' '}
                          {Number(added.price) * Number(added.quantity)}{' '}
                          <div
                            className="btn btn-danger btn-sm"
                            style={style}
                            onClick={() => {
                              setRequestItems(
                                requestItems.filter((item) =>
                                  item !== added ? item : null,
                                ),
                              )
                            }}
                          >
                            Delete item
                          </div>
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

export default PurchaseOrder
