import React from 'react'
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

import { useSelector } from 'react-redux'
import { useRef } from 'react'
import ReactToPrint from 'react-to-print'
import PrintTemplate1 from '../Printing/PrintTemplate1'
import BackButton from 'src/components/Navigating/BackButton'

const CustomerView = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const selectedCustomer =
    useSelector((state) => state.selection.selected) || {}

  console.log('customer', selectedCustomer)
  const reservations = selectedCustomer.Reservations
    ? selectedCustomer.Reservations
    : []
  const total = reservations.reduce(
    (acc, b) => acc + Number(b.amount['RWF']),
    0,
  )
  const paid = reservations.reduce(
    (acc, b) => acc + Number(b.payment['RWF']),
    0,
  )
  const debt = total - paid

  return (
    <CRow>
      <CCol xs={12}>
        <BackButton />
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between">
            <h3>
              <strong> {selectedCustomer.name} Customer info </strong>
            </h3>
            <div>
              <ReactToPrint
                trigger={() => (
                  <button className="btn btn-ghost-primary">Print</button>
                )}
                content={() => ref || componentRef.current}
              />
            </div>
          </CCardHeader>
          <div style={{ display: 'none' }}>
            <CCardBody>
              <PrintTemplate1 ref={ref || componentRef}>
                <CCol className="my-3">
                  <div className="my-3 col text-center">
                    <p className="fw-bolder text-capitalize lead">
                      {' '}
                      Customer details{' '}
                    </p>
                  </div>
                  <div className="d-flex gap-2 ">
                    <div className="col">
                      <p className="fw-bold"> Name </p>
                      <p className="mb-1"> {selectedCustomer.names}</p>
                    </div>
                    <div className="col">
                      <p className="fw-bold"> ID/Passport </p>
                      <p className="mb-1"> {selectedCustomer.identification}</p>
                    </div>
                    <div className="col">
                      <p className="fw-bold"> Tel </p>
                      <p className="mb-1"> {selectedCustomer.phone}</p>
                    </div>
                  </div>
                </CCol>
                <CRow>
                  <h2 className="text-center">
                    <strong> {selectedCustomer.name} Reservations</strong>
                  </h2>
                  <div>
                    <CTable bordered>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell scope="col">#</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                          <CTableHeaderCell scope="col">
                            {' '}
                            Dates{' '}
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col">
                            {' '}
                            Status{' '}
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col">
                            {' '}
                            Payment{' '}
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col">
                            {' '}
                            Amount{' '}
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {reservations && reservations.length !== 0
                          ? reservations.map((reservation, i) => {
                              return (
                                <CTableRow key={reservation.id}>
                                  <CTableHeaderCell scope="row">
                                    {i + 1}
                                  </CTableHeaderCell>

                                  {selectedCustomer.customerType ===
                                  'company' ? (
                                    <CTableDataCell>
                                      {reservation.details
                                        ? Object.keys(reservation.details).map(
                                            (detail, i) => (
                                              <div key={i}>
                                                <p>
                                                  {detail} rooms :{' '}
                                                  {
                                                    reservation.details[detail]
                                                      .people
                                                  }{' '}
                                                </p>
                                              </div>
                                            ),
                                          )
                                        : reservation.Hall.name}
                                    </CTableDataCell>
                                  ) : (
                                    <CTableDataCell>{`${
                                      reservation.Hall
                                        ? reservation.Hall.name
                                          ? reservation.Hall.name
                                          : ''
                                        : reservation.Room
                                        ? reservation.Room.name
                                          ? reservation.Room.name
                                          : ''
                                        : ''
                                    }`}</CTableDataCell>
                                  )}
                                  <CTableDataCell>
                                    {`${
                                      reservation
                                        ? new Date(
                                            reservation.checkIn,
                                          ).toLocaleDateString() +
                                          ' to ' +
                                          new Date(
                                            reservation.checkOut,
                                          ).toLocaleDateString()
                                        : 'not set'
                                    }`}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {Number(reservation.payment['RWF']) &&
                                    Number(reservation.amount['RWF'])
                                      ? Number(reservation.payment['RWF']) <
                                        Number(reservation.amount['RWF'])
                                        ? `Debt of ${Number(
                                            Math.ceil(
                                              Number(
                                                reservation.amount['RWF'],
                                              ) -
                                                Number(
                                                  reservation.payment['RWF'],
                                                ),
                                            ),
                                          ).toLocaleString()} 
                                     RWF`
                                        : 'Completed'
                                      : ''}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {Number(
                                      Math.ceil(
                                        Number(reservation.payment['RWF']),
                                      ),
                                    ).toLocaleString()}
                                    {' RWF'}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {Number(
                                      Math.ceil(
                                        Number(reservation.amount['RWF']),
                                      ),
                                    ).toLocaleString()}
                                    {' RWF'}
                                  </CTableDataCell>
                                </CTableRow>
                              )
                            })
                          : null}
                        <CTableRow>
                          <CTableHeaderCell colSpan={5}>Total</CTableHeaderCell>
                          <CTableHeaderCell>
                            <p>Total: {total.toLocaleString()} RWF</p>
                            <p>Paid : {paid.toLocaleString()} RWF</p>
                            <p>Debt : {debt.toLocaleString()} RWF</p>
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </div>
                </CRow>
              </PrintTemplate1>
            </CCardBody>
          </div>

          <CCardBody>
            <CCol className="my-3">
              <div className="my-3 col text-center">
                <p className="fw-bolder text-capitalize lead">
                  {' '}
                  Customer details{' '}
                </p>
              </div>
              <div className="d-flex gap-2 ">
                <div className="col">
                  <p className="fw-bold"> Name </p>
                  <p className="mb-1"> {selectedCustomer.names}</p>
                </div>
                <div className="col">
                  <p className="fw-bold"> ID/Passport </p>
                  <p className="mb-1"> {selectedCustomer.identification}</p>
                </div>
                <div className="col">
                  <p className="fw-bold"> Tel </p>
                  <p className="mb-1"> {selectedCustomer.phone}</p>
                </div>
              </div>
            </CCol>
            <CRow>
              <h2 className="text-center">
                <strong> {selectedCustomer.name} Reservations</strong>
              </h2>
              <div>
                <CTable bordered>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col"> Dates </CTableHeaderCell>
                      <CTableHeaderCell scope="col"> Status </CTableHeaderCell>
                      <CTableHeaderCell scope="col"> Payment </CTableHeaderCell>
                      <CTableHeaderCell scope="col"> Amount </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {reservations && reservations.length !== 0
                      ? reservations.map((reservation, i) => {
                          return (
                            <CTableRow key={reservation.id}>
                              <CTableHeaderCell scope="row">
                                {i + 1}
                              </CTableHeaderCell>

                              {selectedCustomer.customerType === 'company' ? (
                                <CTableDataCell>
                                  {reservation.details
                                    ? Object.keys(reservation.details).map(
                                        (detail, i) => (
                                          <div key={i}>
                                            <p>
                                              {detail} rooms :{' '}
                                              {
                                                reservation.details[detail]
                                                  .people
                                              }{' '}
                                            </p>
                                          </div>
                                        ),
                                      )
                                    : reservation.Hall.name}
                                </CTableDataCell>
                              ) : (
                                <CTableDataCell>
                                  {`${
                                    reservation.Hall
                                      ? reservation.Hall.name
                                        ? reservation.Hall.name
                                        : ''
                                      : reservation.Room
                                      ? reservation.Room.name
                                        ? reservation.Room.name
                                        : ''
                                      : ''
                                  }`}
                                </CTableDataCell>
                              )}
                              <CTableDataCell>
                                {`${
                                  reservation
                                    ? new Date(
                                        reservation.DatesIns[
                                          reservation.DatesIns.length - 1
                                        ].datesIn.sort(
                                          (a, b) => new Date(a) - new Date(b),
                                        )[0],
                                      ).toLocaleDateString() +
                                      ' to ' +
                                      new Date(
                                        reservation.DatesIns[
                                          reservation.DatesIns.length - 1
                                        ].datesIn.sort(
                                          (a, b) => new Date(a) - new Date(b),
                                        )[
                                          reservation.DatesIns[
                                            reservation.DatesIns.length - 1
                                          ].datesIn.length - 1
                                        ],
                                      ).toLocaleDateString()
                                    : 'not set'
                                }`}
                              </CTableDataCell>
                              <CTableDataCell>
                                {Number(reservation.payment['RWF']) &&
                                Number(reservation.amount['RWF'])
                                  ? Number(reservation.payment['RWF']) <
                                    Number(reservation.amount['RWF'])
                                    ? `Debt of ${Number(
                                        Math.ceil(
                                          Number(reservation.amount['RWF']) -
                                            Number(reservation.payment['RWF']),
                                        ),
                                      ).toLocaleString()} 
                                     RWF`
                                    : 'Completed'
                                  : ''}
                              </CTableDataCell>
                              <CTableDataCell>
                                {Number(
                                  Math.ceil(Number(reservation.payment['RWF'])),
                                ).toLocaleString()}
                                {' RWF'}
                              </CTableDataCell>
                              <CTableDataCell>
                                {Number(
                                  Math.ceil(Number(reservation.amount['RWF'])),
                                ).toLocaleString()}
                                {' RWF'}
                              </CTableDataCell>
                            </CTableRow>
                          )
                        })
                      : null}
                    <CTableRow>
                      <CTableHeaderCell colSpan={5}>Total</CTableHeaderCell>
                      <CTableHeaderCell>
                        <p>Total: {total.toLocaleString()} RWF</p>
                        <p>Paid : {paid.toLocaleString()} RWF</p>
                        <p>Debt : {debt.toLocaleString()} RWF</p>
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </div>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
})

export default CustomerView
