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
import converter from 'number-to-words'
function DeliveryList(props, ref) {
  const { requestItems, setRequestItems, documentTitle } = props
  const total =
    requestItems && requestItems.length !== 0
      ? requestItems.reduce((a, b) => a + Number(b.unitPrice * b.quantity), 0)
      : 0
  const [style, setStyle] = useState({ display: 'none' })
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h3>
              <strong> {documentTitle ? documentTitle : 'Invoice'} </strong>
            </h3>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="ctable-header-cell-hash">
                    #
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Description </CTableHeaderCell>
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
                        <CTableDataCell> {index + 1} </CTableDataCell>
                        <CTableDataCell>
                          {' '}
                          {added.description || added.name}{' '}
                        </CTableDataCell>
                        <CTableDataCell>
                          {' '}
                          {added.quantity} {added.unit}{' '}
                        </CTableDataCell>
                        <CTableDataCell> {added.unitPrice} </CTableDataCell>
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
                          {Number(added.unitPrice) *
                            Number(added.quantity)}{' '}
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
                  <CTableRow>
                    <CTableHeaderCell colSpan={5}>
                      {' '}
                      No items added
                    </CTableHeaderCell>
                  </CTableRow>
                )}

                <CTableRow>
                  <CTableHeaderCell colSpan={4}>TOTAL</CTableHeaderCell>
                  <CTableHeaderCell>{total.toLocaleString()}</CTableHeaderCell>
                </CTableRow>
              </CTableBody>
            </CTable>
            <p>
              <span className="fw-bold">Total in words with VAT: </span>
              {converter.toWords(total)} Rwandan Francs only
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DeliveryList
