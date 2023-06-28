import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import ReactToPrint from 'react-to-print'
import PrintTemplate1 from '../Printing/PrintTemplate1'
import BackButton from 'src/components/Navigating/BackButton'
import UpdateReservationDates from './UpdateReservationDates'

const ReservationReceipt = (props) => {
  const reservation = props.reservation
  return (
    <CCard>
      <CCardBody>
        <CForm
          className="row"
          name="reservationViewFrm"
          encType="multipart/form"
        >
          <div className="mb-4">
            <CCardBody className="row">
              <CCol md={6}>
                <CFormLabel className="fw-bolder"> Customer details</CFormLabel>
                <div>
                  <CFormLabel> Names</CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={reservation.Customer.names}
                  />
                  <CFormLabel>Phone</CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={reservation.Customer.phone}
                  />
                  <CFormLabel>ID/Passport</CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={reservation.Customer.identification}
                  />
                </div>
              </CCol>
              <CCol md={6}>
                <CFormLabel className="fw-bolder">
                  Reservation details
                </CFormLabel>
                <div>
                  {reservation.Customer.customerType === 'company' ? (
                    <div>
                      {reservation.details
                        ? Object.keys(reservation.details)?.map((e) => (
                            <p>
                              {e} rooms :{' '}
                              {reservation.details[e].people === ''
                                ? 0
                                : reservation.details[e].people}
                            </p>
                          ))
                        : null}
                    </div>
                  ) : (
                    <p className="font-weight-bold">
                      {reservation.Room
                        ? 'Room : ' + reservation.Room.name
                        : 'Hall : ' + reservation.Hall.name}
                    </p>
                  )}
                  <div className="py-2">
                    <p className="fw-bold py-0 my-0">Dates</p>
                    {reservation.DatesIns[
                      reservation.DatesIns.length - 1
                    ].datesIn.map((el, i) => {
                      return (
                        <li key={i * 6721}>
                          {new Date(el).toLocaleDateString()}
                        </li>
                      )
                    })}
                  </div>

                  <p className="font-weight-bold">
                    Total :{' '}
                    {Object.keys(reservation.amount).map((curr) => (
                      <p>
                        {curr} :{' '}
                        {Number(
                          Math.ceil(reservation.amount[curr]),
                        ).toLocaleString()}
                      </p>
                    ))}
                  </p>
                  <p className="font-weight-bold">
                    Paid :{' '}
                    {Object.keys(reservation.payment).map((curr) => (
                      <p>
                        {curr} :{' '}
                        {Number(
                          Math.ceil(Number(reservation.payment[curr])),
                        ).toLocaleString()}
                      </p>
                    ))}
                  </p>
                  <p className="font-weight-bold">
                    Debt :{' '}
                    {Number(
                      Math.ceil(
                        Number(reservation.amount['RWF']) -
                          Number(reservation.payment['RWF']),
                      ),
                    ).toLocaleString()}{' '}
                    RWF
                  </p>
                </div>
              </CCol>
            </CCardBody>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

const ReservationView = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  let reservation = useSelector((state) => state.selection.selected)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [updated, setUpdated] = useState(false)
  if (updated) {
    reservation = { ...reservation, ...updated }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <BackButton />
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between">
              <h5>
                <strong>
                  {' '}
                  Reservation by {' ' + reservation.Customer.names + ' for '}
                  {reservation.Customer.customerType !== 'company'
                    ? reservation.Room
                      ? `R${reservation.Room.name}`
                      : reservation.Hall.name + 'Hall'
                    : null}
                </strong>
              </h5>
              <div>
                <button
                  className="btn btn-success "
                  onClick={() => {
                    setOpenUpdate(true)
                  }}
                >
                  Update reservation
                </button>
                <ReactToPrint
                  trigger={() => (
                    <button className="btn btn-ghost-primary">Print</button>
                  )}
                  content={() => ref || componentRef.current}
                />
              </div>
            </div>
          </CCardHeader>
        </CCard>
        <div style={{ display: 'none' }}>
          <PrintTemplate1 ref={ref || componentRef} title={`Reservation`}>
            <ReservationReceipt reservation={reservation} />
          </PrintTemplate1>
        </div>
        <ReservationReceipt reservation={reservation} />
        <UpdateReservationDates
          openUpdate={openUpdate}
          reservation={reservation}
          setOpenUpdate={setOpenUpdate}
          setUpdated={setUpdated}
        />
      </CCol>
    </CRow>
  )
})

export default ReservationView
