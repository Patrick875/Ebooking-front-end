import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCol,
  CForm,
} from '@coreui/react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function ReservationUpdates(props) {
  let { openUpdates, setOpenUpdates } = props
  const reservation = useSelector((state) => state.selection.selected)
  const [datesIn, setDatesIn] = useState([...reservation.DatesIns])

  return (
    <React.Fragment>
      <CModal
        alignment="center"
        visible={openUpdates}
        size="lg"
        onClose={() => setOpenUpdates(false)}
      >
        <CForm>
          <CModalHeader>
            <CModalTitle className="text-center">
              Reservation updates
            </CModalTitle>
          </CModalHeader>
          <div className="ms-3">
            <p>
              Revervation by{' '}
              <span className="fw-bold">
                {reservation && Object.keys(reservation).length !== 0
                  ? reservation.Customer.names
                  : null}
              </span>
            </p>
          </div>
          <CModalBody>
            <CCol>
              <p className=" text-center fw-bold ">Reservation Dates</p>
              {datesIn.length !== 0 ? (
                <div>
                  {datesIn.map((el, i) => (
                    <div key={i * 3456} className="d-flex gap-2">
                      <p>
                        As of{' '}
                        <span className="fw-bold">
                          {new Date(el.date).toLocaleDateString()}
                        </span>{' '}
                        :{' '}
                      </p>
                      {el.datesIn.length !== 0 ? (
                        el.datesIn.map((curr, i) => (
                          <li key={i * 234}>
                            {new Date(curr).toLocaleDateString()}{' '}
                          </li>
                        ))
                      ) : (
                        <p>No dates</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </CCol>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setOpenUpdates(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </React.Fragment>
  )
}

export default ReservationUpdates
