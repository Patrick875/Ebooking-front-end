import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CFormSelect,
  CCol,
  CFormInput,
  CForm,
} from '@coreui/react'

import React, { useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { instance } from 'src/API/AxiosInstance'

function UpdateReservationDates(props) {
  let { openUpdate, setOpenUpdate, setUpdated } = props
  const reservation = useSelector((state) => state.selection.selected)
  const [datesIn, setDatesIn] = useState([
    ...reservation.DatesIns[reservation.DatesIns.length - 1].datesIn,
  ])
  const { handleSubmit, reset } = useForm()
  const onSubmit = async (data) => {
    let submission = {
      id: reservation.id,
      datesIn,
      amount: reservation.Room
        ? Number(reservation.Room.RoomClass.price * datesIn.length)
        : Number(reservation.Hall.price * datesIn.length),
      currency: reservation.Room ? 'USD' : 'RWF',
    }

    await instance
      .post('/reservation/updatedates', { ...submission })
      .then((res) => {
        toast.success(res.data.message)
        setUpdated(res.data.data)
        setOpenUpdate(false)
      })
      .catch((err) => {
        toast.error(err.message)
      })
    reset()
  }

  return (
    <React.Fragment>
      <CModal alignment="center" visible={openUpdate} size="lg">
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <CModalHeader>
            <CModalTitle className="text-center">
              Update Reservation
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
            <CCol className="d-flex">
              <div className="col">
                <CFormLabel htmlFor="checkIn" className="d-block">
                  Dates In
                </CFormLabel>
                <ReactDatePicker
                  className="form-control"
                  multiple
                  highlightDates={datesIn}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  onChange={(date) => setDatesIn([...datesIn, new Date(date)])}
                  inline
                  placeholderText="Select a date other than  yesterday"
                />
              </div>
              {datesIn.length !== 0 ? (
                <div>
                  <p className=" text-center ">Reservation Dates</p>
                  {datesIn.map((current, i) => (
                    <div key={i * 3456} className="d-flex gap-2">
                      <li>{new Date(current).toLocaleDateString()} </li>
                      <p
                        className="text-danger"
                        onClick={() => {
                          let newDatesIn = datesIn.filter(
                            (el) => el !== current,
                          )
                          setDatesIn(newDatesIn)
                        }}
                      >
                        Remove
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </CCol>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setOpenUpdate(false)}>
              Close
            </CButton>
            <CButton color="primary" type="submit">
              Save changes
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </React.Fragment>
  )
}

export default UpdateReservationDates