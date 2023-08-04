import React from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
} from '@coreui/react'
import AddPaymentModal from './AddPaymentModal'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { isRoomOccupied, removeDatesAfterToday } from 'src/utils/functions'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const Checkout = (props) => {
  const [rooms, setRooms] = useState([])
  const selectedReservation = useSelector((state) => state.selection.selected)
  const [open, setOpen] = useState(false)
  const { register, watch } = useForm()
  const roomId = watch('room')
  const selectedRoom =
    rooms && Object.keys(selectedReservation).length === 0
      ? rooms.filter((room) => room.id == roomId)[0]
      : selectedReservation.Room
  let roomReservation = selectedRoom ? isRoomOccupied(selectedRoom) : {}
  const [reservation, setReservation] = useState()
  const checkout = async () => {
    let newDatesIn = removeDatesAfterToday(
      selectedReservation.DatesIns[selectedReservation.DatesIns.length - 1]
        .datesIn,
    )
    await instance
      .post('/reservation/checkout', {
        id: roomReservation.reservation.id,
        datesIn: newDatesIn,
        amount: selectedReservation.Room
          ? Number(selectedRoom.RoomClass.price * newDatesIn.length)
          : Number(reservation.Hall.price * newDatesIn.length),
        currency: 'USD',
        process: 'checking-out',
      })
      .then((res) => {
        if (res.data.data) {
          toast.success('client checked out')
        }
      })
      .catch((er) => {
        console.log('err', er)
      })
  }
  if (reservation) {
    checkout()
    roomReservation.reservation = reservation
  }

  useEffect(() => {
    const getRooms = async () => {
      await instance
        .get('/room/all')
        .then((res) => {
          if (res && res.data && res.data) {
            setRooms(res.data.data)
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    getRooms()
  }, [])

  return (
    <div>
      <CCardBody className="row">
        <CCol className="d-flex justify-content-between">
          <p className="fw-bold fs-4 ">Checkout Customer</p>

          <CCol md={4} className="">
            <CCol className="d-flex gap-3">
              <CFormSelect {...register('room')}>
                {rooms.map((el, i) => (
                  <option
                    value={
                      Object.keys(selectedReservation).length === 0
                        ? el.id
                        : selectedReservation.Room.id
                    }
                    selected={
                      Object.keys(selectedReservation).length === 0
                        ? rooms[0].id
                        : selectedReservation.Room.id
                    }
                  >
                    {el.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CCol>
        </CCol>

        <div>
          {Object.keys(roomReservation).length === 0 ? (
            <p>This room is not currently occupied</p>
          ) : (
            <CCard>
              <div className="d-flex gap-3">
                <CCol md={6} className="p-2 m-2">
                  <CFormLabel className="fw-bolder">
                    {' '}
                    Customer details
                  </CFormLabel>
                  <div>
                    <CFormLabel> Names</CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="title"
                      id="title"
                      required
                      value={roomReservation.reservation.Customer.names}
                    />
                    <CFormLabel>Phone</CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="title"
                      id="title"
                      required
                      value={roomReservation.reservation.Customer.phone}
                    />
                    <CFormLabel>ID/Passport</CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="title"
                      id="title"
                      required
                      value={
                        roomReservation.reservation.Customer.identification
                      }
                    />
                  </div>

                  <div className="checkout-final mt-3">
                    {Number(
                      Math.round(
                        Number(roomReservation.reservation.amount['RWF']) -
                          Number(roomReservation.reservation.payment['RWF']),
                      ),
                    ) > 0 ? (
                      <React.Fragment>
                        <button
                          onClick={() => {
                            return checkout()
                          }}
                        >
                          Checkout with debt
                        </button>
                        <button
                          onClick={() => {
                            setOpen(true)
                          }}
                        >
                          Clear debt and Checkout{' '}
                        </button>
                      </React.Fragment>
                    ) : (
                      <button
                        onClick={() => {
                          return checkout()
                        }}
                      >
                        Checkout
                      </button>
                    )}
                  </div>
                </CCol>
                <CCol md={6} className="p-2 m-2">
                  <CFormLabel className="fw-bolder">
                    Reservation details
                  </CFormLabel>
                  <div>
                    <p>
                      <span className="fw-bold">Room </span>:{' '}
                      {selectedRoom.name}
                    </p>
                    <div className="py-2">
                      <p className="fw-bold py-0 my-0">Dates</p>
                      {roomReservation.reservation.DatesIns[
                        roomReservation.reservation.DatesIns.length - 1
                      ].datesIn.map((el, i) => {
                        return (
                          <li key={i * 6721}>
                            {new Date(el).toLocaleDateString('fr-FR')}
                          </li>
                        )
                      })}
                    </div>

                    <p className="font-weight-bold">
                      Total :{' '}
                      {Object.keys(roomReservation.reservation.amount).map(
                        (curr) => (
                          <p>
                            {curr} :{' '}
                            {Number(
                              Math.round(
                                roomReservation.reservation.amount[curr],
                              ),
                            ).toLocaleString()}
                          </p>
                        ),
                      )}
                    </p>
                    <p className="font-weight-bold">
                      Paid :{' '}
                      {Object.keys(roomReservation.reservation.payment).map(
                        (curr) => (
                          <p>
                            {curr} :{' '}
                            {Number(
                              Math.round(
                                Number(
                                  roomReservation.reservation.payment[curr],
                                ),
                              ),
                            ).toLocaleString()}
                          </p>
                        ),
                      )}
                    </p>
                    <p className="font-weight-bold">
                      Debt :{' '}
                      {Number(
                        Math.round(
                          Number(roomReservation.reservation.amount['RWF']) -
                            Number(roomReservation.reservation.payment['RWF']),
                        ),
                      ).toLocaleString()}{' '}
                      RWF
                    </p>
                  </div>
                </CCol>
              </div>
            </CCard>
          )}
        </div>
        <AddPaymentModal
          reservation={roomReservation.reservation}
          open={open}
          setOpen={setOpen}
          setReservation={setReservation}
          payAndCheckout={true}
        />
      </CCardBody>
    </div>
  )
}
export default Checkout
