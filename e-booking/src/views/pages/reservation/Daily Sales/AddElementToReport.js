import {
  CCardBody,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useState } from 'react'

const AddElementToReport = (props) => {
  const [show, setShow] = useState(false)
  const { reportItems, setReportItems, user, totals } = props

  return (
    <div>
      <CCardBody>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col"> Element </CTableHeaderCell>
              <CTableHeaderCell scope="col"> From (name) </CTableHeaderCell>
              <CTableHeaderCell scope="col"> Payment method </CTableHeaderCell>
              <CTableHeaderCell scope="col"> Currency </CTableHeaderCell>
              <CTableHeaderCell scope="col"> Amount </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {reportItems && reportItems.length !== 0 ? (
              <React.Fragment>
                {reportItems.map((added, index) => {
                  return (
                    <CTableRow
                      key={index + 1}
                      onMouseEnter={() => {
                        setShow(true)
                      }}
                      onMouseLeave={() => {
                        setShow(false)
                      }}
                    >
                      <CTableHeaderCell scope="row">
                        {' '}
                        {index + 1}{' '}
                      </CTableHeaderCell>
                      <CTableDataCell> {added.title} </CTableDataCell>
                      <CTableDataCell>
                        {' '}
                        {user && user.length !== 0
                          ? user[0].firstName + ' ' + user[0].lastName
                          : null}{' '}
                      </CTableDataCell>
                      <CTableDataCell>{added.paymentMethod} </CTableDataCell>
                      <CTableDataCell> {added.currency} </CTableDataCell>
                      <CTableDataCell>
                        {added.amount}

                        {show && setReportItems ? (
                          <div
                            className="btn btn-danger btn-sm ms-2"
                            onClick={() => {
                              setReportItems(
                                reportItems.filter((item) =>
                                  item !== added ? item : null,
                                ),
                              )
                            }}
                          >
                            Delete item
                          </div>
                        ) : null}
                      </CTableDataCell>
                    </CTableRow>
                  )
                })}
                <CTableRow key={reportItems.length}>
                  <CTableHeaderCell scope="row"></CTableHeaderCell>
                  <CTableHeaderCell colSpan={4}> Total </CTableHeaderCell>
                  <CTableDataCell>
                    {totals && Object.keys(totals).length !== 0
                      ? Object.keys(totals).map((total) => (
                          <p>
                            {total} : {Number(totals[total]).toLocaleString()}
                          </p>
                        ))
                      : 0}
                  </CTableDataCell>
                </CTableRow>
              </React.Fragment>
            ) : (
              <div className="text-center"> No items added</div>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </div>
  )
}

export default AddElementToReport
