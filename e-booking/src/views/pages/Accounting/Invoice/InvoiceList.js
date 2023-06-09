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

import { useSelector } from 'react-redux'
function InvoiceList(props, ref) {
  const { requestItems, setRequestItems, documentTitle } = props
  const VATconstant = useSelector((state) =>
    state.constants.constants.filter((constant) => constant.name === 'VAT'),
  )[0] || { value: 0, name: 'VAT' }

  const value =
    requestItems && requestItems.length !== 0
      ? requestItems.reduce(
          (a, b) => a + Number(b.price * b.quantity * b.times),
          0,
        )
      : 0

  const VAT =
    requestItems && requestItems.length !== 0
      ? requestItems[0].VAT
      : 'inclusive'

  const amountVAT = Number((value * VATconstant.value) / 100)

  const total =
    VAT === 'exclusive' ? Number(value - amountVAT) : Number(value + amountVAT)
  const [style, setStyle] = useState({ display: 'none' })
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            {documentTitle ? (
              <h3>
                <strong> {documentTitle ? documentTitle : 'Invoice'} </strong>
              </h3>
            ) : null}
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
                  <CTableHeaderCell scope="col"> TIMES </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> P.U </CTableHeaderCell>
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
                          {added.name || added.description}{' '}
                        </CTableDataCell>
                        <CTableDataCell> {added.quantity}</CTableDataCell>
                        <CTableDataCell> {added.times} </CTableDataCell>
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
                          {Number(
                            added.price * added.quantity * added.times,
                          )}{' '}
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
                    <CTableHeaderCell colSpan={6}>
                      {' '}
                      No items added
                    </CTableHeaderCell>
                  </CTableRow>
                )}
                <CTableRow>
                  <CTableHeaderCell colSpan={5}>VALUE</CTableHeaderCell>
                  <CTableHeaderCell>
                    {value.toLocaleString() || 0}
                  </CTableHeaderCell>
                </CTableRow>
                <CTableRow colSpan={5}>
                  <CTableHeaderCell colSpan={5}>VAT</CTableHeaderCell>
                  <CTableHeaderCell>
                    {amountVAT.toLocaleString() || 0}
                  </CTableHeaderCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell colSpan={5}>TOTAL</CTableHeaderCell>
                  <CTableHeaderCell>
                    {total.toLocaleString() || 0}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default InvoiceList
