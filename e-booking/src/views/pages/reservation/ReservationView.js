import { CCard, CCardBody, CCardHeader, CCol, CForm, CRow } from '@coreui/react'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import ReactToPrint from 'react-to-print'
import PrintTemplate1 from '../Printing/PrintTemplate1'
import BackButton from 'src/components/Navigating/BackButton'
import UpdateReservationDates from './UpdateReservationDates'
import { Link, useNavigate } from 'react-router-dom'
import { isRoomOccupied, removeDatesAfterToday } from 'src/utils/functions'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import AddPaymentModal from './AddPaymentModal'
import { MdDelete } from 'react-icons/md'

const ReservationReceipt = (props) => {
  const reservation = props.reservation
  const navigate = useNavigate()

  const removeBill = async (reservationId, billId) => {
    await instance
      .post('/customerbill/remove-from-reservation', {
        reservationId,
        id: billId,
      })
      .then((res) => {
        if (res && res.data && res.data.data) {
          toast.success('Success... Bill deleted')
          navigate(-1)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
  const removeVaucher = async (reservationId, billId) => {
    await instance
      .post('/services/vaucher/remove-from-reservation', {
        reservationId,
        id: billId,
      })
      .then((res) => {
        if (res && res.data && res.data.data) {
          toast.success('Success vaucher removed')
          navigate(-1)
        }
      })
      .catch((er) => {
        console.log('err', er)
      })
  }

  return (
    <div className="bg-white px-3 py-3 rounded-1">
      <div className="bg-white">
        <CForm
          className="row"
          name="reservationViewFrm"
          encType="multipart/form"
        >
          <div className="mb-4">
            <CCardBody>
              <div className="d-flex justify-content-between">
                <div>
                  <p className="py-0 my-0">
                    Names:{' '}
                    <span className="fw-bold">
                      {reservation.affiliation
                        ? reservation.affiliation.names
                        : reservation.Customer.names}
                    </span>{' '}
                  </p>
                  <p className="py-0 my-0">
                    Tel :{' '}
                    <span className="fw-bold">
                      {reservation.affiliation
                        ? reservation.affiliation.phone
                        : reservation.Customer.phone}
                    </span>
                  </p>
                  <p className="py-0 my-0">
                    ID/Passport:{' '}
                    <span className="fw-bold">
                      {reservation.affiliation
                        ? reservation.affiliation.identification
                        : reservation.Customer.identification}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="fs-5 py-0 my-0">
                    Total :{' '}
                    <span className="fw-bold">
                      {' '}
                      {Number(
                        reservation.grandTotal
                          ? Math.round(reservation.grandTotal)
                          : Math.round(reservation.amount.RWF),
                      ).toLocaleString()}
                    </span>{' '}
                    RWF
                  </p>
                  <p className="fs-5 py-0 my-0">
                    Paid :{' '}
                    <span className="fw-bold">
                      {' '}
                      {Number(reservation.payment.RWF).toLocaleString()}
                    </span>{' '}
                    RWF
                  </p>
                </div>
              </div>
              <div>
                <p className="text-center fw-bold">Details</p>
                <p className="fw-bold">Room</p>
                <div className="editableTable">
                  <table>
                    <thead>
                      <tr>
                        <th>Date(s)</th>
                        <th>Description</th>
                        <th>Days</th>
                        <th>U.P</th>
                        <th>T.P</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ borderBottom: 'none' }}>
                          <div className="ps-2 fw-bold">
                            {reservation.DatesIns.sort(
                              (a, b) => b.id - a.id,
                            )[0].datesIn.map((date) => (
                              <p className="py-0 my-0">
                                {new Date(date).toLocaleDateString('fr-FR')}
                              </p>
                            ))}
                          </div>
                        </td>
                        <td style={{ borderBottom: 'none' }}>
                          <input
                            name={'description'}
                            readOnly
                            type="text"
                            placeholder=""
                            value={'Room R#' + reservation.Room.name}
                          />
                        </td>
                        <td style={{ borderBottom: 'none' }}>
                          <input
                            name="quantity"
                            type="text"
                            readOnly
                            placeholder=""
                            value={
                              reservation.DatesIns.sort(
                                (a, b) => b.id - a.id,
                              )[0].datesIn.length
                            }
                          />
                        </td>
                        <td style={{ borderBottom: 'none' }}>
                          <input
                            name={'price'}
                            type="text"
                            readOnly
                            placeholder=""
                            value={
                              reservation.Room.RoomClass.price +
                              'USD / ' +
                              Number(
                                reservation.amount.RWF /
                                  reservation.DatesIns.sort(
                                    (a, b) => b.id - a.id,
                                  )[0].datesIn.length,
                              ).toLocaleString() +
                              'RWF'
                            }
                          />
                        </td>
                        <td style={{ borderBottom: 'none' }}>
                          <input
                            name="total"
                            type="text"
                            readOnly
                            placeholder=""
                            value={
                              Number(reservation.amount.USD).toLocaleString() +
                              'USD/' +
                              Number(reservation.amount.RWF).toLocaleString() +
                              'RWF'
                            }
                          />
                        </td>
                      </tr>
                      <tr className="lastRows">
                        <td>
                          <input
                            readOnly
                            type="text"
                            value="TOTAL"
                            className="fw-bold"
                          />
                        </td>
                        <td style={{ borderBottom: 'none' }} />
                        <td style={{ borderBottom: 'none' }} />
                        <td style={{ borderBottom: 'none' }} />
                        <td style={{ borderBottom: 'none' }}>
                          <input
                            className="fw-bold"
                            name="total"
                            type="text"
                            readOnly
                            placeholder=""
                            value={
                              Number(reservation.amount.USD).toLocaleString() +
                              'USD/' +
                              Number(
                                Math.round(reservation.amount.RWF),
                              ).toLocaleString() +
                              'RWF'
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {reservation.CustomerBills &&
                reservation.CustomerBills.length !== 0 ? (
                  <div>
                    <p className="fw-bold">Restaurant/Bar</p>
                    {reservation.CustomerBills &&
                    reservation.CustomerBills.length !== 0
                      ? reservation.CustomerBills.map((el, i) => (
                          <div className="editableTable py-1" key={el.id}>
                            <div
                              type="button"
                              className="d-flex justify-content-end my-0 py-0 align-items-center"
                              onClick={() => {
                                console.log('data', { reservation, el })
                                return removeBill(reservation.id, el.id)
                              }}
                            >
                              Remove
                              <MdDelete className="text-danger py-0 my-0" />
                            </div>
                            <table>
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Description</th>
                                  <th>Quantity</th>
                                  <th>U.P</th>
                                  <th>T.P</th>
                                </tr>
                              </thead>
                              <tbody>
                                {el.CustomerBillDetails
                                  ? el.CustomerBillDetails.map((item, i) => (
                                      <tr>
                                        <td style={{ borderBottom: 'none' }}>
                                          <input
                                            name={'date'}
                                            readOnly
                                            type="text"
                                            placeholder=""
                                            value={new Date(
                                              el.date,
                                            ).toLocaleDateString('fr-FR')}
                                          />
                                        </td>
                                        <td style={{ borderBottom: 'none' }}>
                                          <input
                                            className="text-capitalize"
                                            name={'description'}
                                            readOnly
                                            type="text"
                                            placeholder=""
                                            value={
                                              el.CustomerBillDetails[0].Product
                                                .name
                                            }
                                          />
                                        </td>
                                        <td style={{ borderBottom: 'none' }}>
                                          <input
                                            name="quantity"
                                            type="text"
                                            readOnly
                                            placeholder=""
                                            value={
                                              el.CustomerBillDetails[0].quantity
                                            }
                                          />
                                        </td>
                                        <td style={{ borderBottom: 'none' }}>
                                          <input
                                            name={'price'}
                                            type="text"
                                            readOnly
                                            placeholder=""
                                            value={
                                              Number(
                                                el.amount /
                                                  el.CustomerBillDetails[0]
                                                    .quantity,
                                              ).toLocaleString() + ' RWF'
                                            }
                                          />
                                        </td>
                                        <td style={{ borderBottom: 'none' }}>
                                          <input
                                            name="total"
                                            readOnly
                                            type="text"
                                            placeholder=""
                                            value={
                                              Number(
                                                el.amount,
                                              ).toLocaleString() + ' RWF'
                                            }
                                          />
                                        </td>
                                      </tr>
                                    ))
                                  : null}
                                <tr className="lastRows">
                                  <td>
                                    <input
                                      readOnly
                                      type="text"
                                      value="TOTAL"
                                      className="fw-bold"
                                    />
                                  </td>
                                  <td style={{ borderBottom: 'none' }} />
                                  <td style={{ borderBottom: 'none' }} />
                                  <td style={{ borderBottom: 'none' }} />
                                  <td style={{ borderBottom: 'none' }}>
                                    <input
                                      className="fw-bold col-8"
                                      name="total"
                                      type="text"
                                      readOnly
                                      placeholder=""
                                      value={
                                        Number(el.amount).toLocaleString() +
                                        ' RWF'
                                      }
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ))
                      : null}
                  </div>
                ) : null}
                {reservation.ServiceTransactions &&
                reservation.ServiceTransactions.length !== 0 ? (
                  <div>
                    <p className="fw-bold">Other Services</p>
                    {reservation.ServiceTransactions &&
                    reservation.ServiceTransactions.length !== 0 ? (
                      <div className="editableTable py-1">
                        <table>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Description</th>
                              <th>Quantity</th>
                              <th>U.P</th>
                              <th>T.P</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reservation.ServiceTransactions.length !== 0
                              ? reservation.ServiceTransactions.map(
                                  (item, i) => (
                                    <tr>
                                      <td style={{ borderBottom: 'none' }}>
                                        <input
                                          name={'date'}
                                          readOnly
                                          type="text"
                                          placeholder=""
                                          value={new Date(
                                            item.createdAt,
                                          ).toLocaleDateString('fr-FR')}
                                        />
                                      </td>
                                      <td style={{ borderBottom: 'none' }}>
                                        <input
                                          className="text-capitalize"
                                          name={'description'}
                                          readOnly
                                          type="text"
                                          placeholder=""
                                          value={item.Service.name}
                                        />
                                      </td>
                                      <td style={{ borderBottom: 'none' }}>
                                        <input
                                          name="quantity"
                                          type="text"
                                          readOnly
                                          placeholder=""
                                          value={1}
                                        />
                                      </td>
                                      <td style={{ borderBottom: 'none' }}>
                                        <input
                                          name={'price'}
                                          type="text"
                                          readOnly
                                          placeholder=""
                                          value={
                                            Number(
                                              item.Service.price,
                                            ).toLocaleString() + ' RWF'
                                          }
                                        />
                                      </td>
                                      <td style={{ borderBottom: 'none' }}>
                                        <div className="col d-flex ">
                                          <input
                                            name="total"
                                            className="col-8"
                                            readOnly
                                            type="text"
                                            placeholder=""
                                            value={
                                              Number(
                                                item.total,
                                              ).toLocaleString() + ' RWF'
                                            }
                                          />
                                          <div
                                            type="button"
                                            className="d-flex justify-content-end my-0 py-0 align-items-center"
                                            onClick={() => {
                                              return removeVaucher(
                                                reservation.id,
                                                item.id,
                                              )
                                            }}
                                          >
                                            <MdDelete className="text-danger py-0 my-0" />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  ),
                                )
                              : null}
                            <tr className="lastRows">
                              <td>
                                <input
                                  readOnly
                                  type="text"
                                  value="TOTAL"
                                  className="fw-bold"
                                />
                              </td>
                              <td style={{ borderBottom: 'none' }} />
                              <td style={{ borderBottom: 'none' }} />
                              <td style={{ borderBottom: 'none' }} />
                              <td style={{ borderBottom: 'none' }}>
                                <input
                                  className="fw-bold"
                                  name="total"
                                  type="text"
                                  readOnly
                                  placeholder=""
                                  value={
                                    Number(
                                      reservation.ServiceTransactions.reduce(
                                        (a, b) => a + b.total,
                                        0,
                                      ),
                                    ).toLocaleString() + ' RWF'
                                  }
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </CCardBody>
          </div>
        </CForm>
      </div>
    </div>
  )
}

const ReservationView = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  let reservation = useSelector((state) => state.selection.selected)
  console.log('reservation', reservation)
  const [openModal, setOpenModal] = useState(false)
  const [result, setResult] = useState()
  const debt = reservation
    ? Number(reservation.grandTotal - reservation.payment['RWF'])
    : false
  const [openUpdate, setOpenUpdate] = useState(false)
  const [updated, setUpdated] = useState(false)
  // if (updated) {
  //   reservation = { ...reservation, ...updated }
  // }
  const checkout = async () => {
    let newDatesIn = removeDatesAfterToday(
      reservation.DatesIns[reservation.DatesIns.length - 1].datesIn,
    )
    const newAmount = reservation.Room
      ? Number(reservation.Room.RoomClass.price * newDatesIn.length)
      : Number(reservation.Hall.price * newDatesIn.length)

    await instance
      .post('/reservation/checkout', {
        id: reservation.id,
        datesIn: newDatesIn,
        amount: newAmount,
        grandTotal: Number(
          reservation.grandTotal - reservation.amount['RWF'] + newAmount,
        ),
        currency: 'USD',
        process: 'checking-out',
      })
      .then((res) => {
        if (res.data.data) {
          toast.success('client checked out')
          console.log('checked out', res.data.data)
        }
      })
      .catch((er) => {
        console.log('err', er)
      })
  }
  return (
    <CRow>
      <CCol xs={12}>
        <div className="d-flex justify-content-between">
          <BackButton />
          <Link className="btn" to="/booking/room/addbill">
            Add Bill
          </Link>
        </div>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between">
              <h5>
                <strong>
                  {' '}
                  Reservation by{' '}
                  {reservation.affiliation
                    ? reservation.affiliation.names + '/'
                    : ''}
                  {' ' + reservation.Customer.names + ' for '}
                  {reservation.Room
                    ? `R${reservation.Room.name}`
                    : reservation.Hall.name + 'Hall'}
                </strong>
              </h5>
              {reservation &&
              reservation.Room &&
              reservation.Room.Reservations &&
              Object.keys(isRoomOccupied(reservation.Room)).length !== 0 ? (
                <div>
                  {reservation.roomStatus === 'checked-out' ? (
                    <p style={{ color: 'red', fontWeight: 'bold' }}>
                      CHECKED OUT
                    </p>
                  ) : (
                    <Link
                      onClick={() => {
                        if (debt && debt > 0) {
                          setOpenModal(true)
                        } else if (debt === 0) {
                          checkout()
                        }
                      }}
                      className="btn "
                      style={{ backgroundColor: 'black', color: 'white' }}
                    >
                      Check-out
                    </Link>
                  )}
                </div>
              ) : null}

              <div>
                {reservation.roomStatus &&
                reservation.roomStatus === 'checked-out' ? null : (
                  <button
                    className="btn btn-success "
                    onClick={() => {
                      setOpenUpdate(true)
                    }}
                  >
                    Update reservation
                  </button>
                )}

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
          <PrintTemplate1 ref={ref || componentRef} title={`CLIENT CHECKOUT`}>
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
        <AddPaymentModal
          reservation={reservation}
          open={openModal}
          setOpen={setOpenModal}
          setReservation={setResult}
          payAndCheckout={true}
        />
      </CCol>
    </CRow>
  )
})

export default ReservationView
