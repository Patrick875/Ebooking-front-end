import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Highlighter, Typeahead } from 'react-bootstrap-typeahead'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CFormCheck,
  CModal,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { filterDateDuplicates, getAllDates } from 'src/utils/functions'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'
import { currencies } from 'src/utils/constants'
import CustomerAdd from '../Customer/CustomerAdd'
import { AiOutlineCloseCircle } from 'react-icons/ai'

const CreateCustomerModal = (props) => {
  const { visible, setVisible, setNewCustomer } = props
  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={() => setVisible(false)}
      size="lg"
    >
      <CustomerAdd setNewCustomer={setNewCustomer} />
    </CModal>
  )
}

const RoomCheckin = (props) => {
  const { register, handleSubmit, watch, reset } = useForm()
  const roomFromRoomClass = {}
  const [customer, setCustomer] = useState([])
  let [service, setService] = useState([])
  if (roomFromRoomClass && Object.keys(roomFromRoomClass).length !== 0) {
    service[0] = roomFromRoomClass
  }

  const selectedRoom = useSelector((state) => state.reservation.selectedRoom)

  let [customers, setCustomers] = useState([])
  let [apicurrencies, setApiCurrencies] = useState([])
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [visible, setVisible] = useState(false)
  const [newCustomer, setNewCustomer] = useState()

  let loggedInUser = useSelector((state) => state.auth.user.Role.name)
  let user = useSelector((state) => state.auth.user)

  let priceRoom = selectedRoom.RoomClass.price

  const type =
    watch('booking_type') ||
    'room' ||
    (roomFromRoomClass && Object.keys(roomFromRoomClass).length !== 0)
      ? 'room'
      : null

  const details = watch('details') || null
  const payment = watch('payment') || 0

  const [datesIn, setDatesIn] = useState([])

  const dontSubmit = payment < 0 ? true : false

  const time =
    new Date(startDate).getTime() !== 0 && new Date(endDate).getTime() !== 0
      ? new Date(endDate).getTime() - new Date(startDate).getTime()
      : null
  const days = Math.ceil(time / (1000 * 3600 * 24)) || 1

  let totalPrice = []

  const removeDates =
    service && service.length !== 0 ? getAllDates(service[0]) : []
  const [reload, setReload] = useState()

  props = { ...props }
  props.renderMenuItemChildren = (option, { text }) => (
    <div>
      <Highlighter search={text}>
        {option.name + ' : ' + option.RoomClass.name}
      </Highlighter>
    </div>
  )

  const onSubmit = (data) => {
    data.roomId = selectedRoom.id
    data.amount = selectedRoom.RoomClass.price * datesIn.length

    if (data.children_number === '') {
      delete data.children_number
    }
    if (data.adults_number === '') {
      delete data.adults_number
    }
    data = {
      ...data,
      customerId: customer[0].id,
      userId: user.id,
      checkIn: new Date(startDate.toString()).getTime(),
      checkOut: new Date(endDate.toString()).getTime(),
      status: 'in progress',
      datesIn: datesIn,
    }

    const createReservation = async () => {
      await instance
        .post('/reservation/add', {
          ...data,
          status: 'confirmed',
          roomStatus: 'occupied',
        })
        .then((res) => {
          if (res.data.data) {
            toast.success('Reservation created')
          } else {
            console.log('Rerservation creation failed')
          }
          setReload(res)
        })
        .catch((err) => {
          console.log('err', err)
        })

      setCustomer([])
      setService([])
    }
    createReservation()
    reset()
    setDatesIn([])
  }
  const [localExchangeRate, setLocalExchangeRate] = useState(0)

  const getCurrencyRates = async () => {
    await instance.get('/currency/rate').then((res) => {
      if (res && res.data && res.data.data) {
        setApiCurrencies([...res.data.data])
      }
      if (apicurrencies.length !== 0) {
        setLocalExchangeRate(
          apicurrencies.filter((el) => el.name === 'RWF')[0].rate,
        )
      }
    })
  }
  if (apicurrencies.length === 0) {
    getCurrencyRates()
  }
  useEffect(() => {
    const getCustomers = async () => {
      await instance
        .get('/customers/all')
        .then((res) => {
          if (res && res.data && res.data.data) {
            setCustomers(res.data.data)
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    getCurrencyRates()
    getCustomers()
  }, [newCustomer])

  return (
    <React.Fragment>
      <CreateCustomerModal
        visible={visible}
        setVisible={setVisible}
        setNewCustomer={setNewCustomer}
      />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h5>
                <strong> Room #{selectedRoom.name} </strong>
              </h5>
            </CCardHeader>
            <CCardBody>
              <CForm
                className="row"
                name="reservationAddFrm"
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form"
              >
                <div className="mb-4">
                  <CCardBody className="row">
                    <CCol md={6}>
                      <div>
                        <div className=" col d-flex flex-row justify-content-between">
                          <CFormLabel htmlFor="customer" className="d-block">
                            {' '}
                            Customer{' '}
                          </CFormLabel>
                          {customer && customer.length === 0 ? (
                            <Link
                              className="d-block text-decoration-none"
                              onClick={() => setVisible(!visible)}
                            >
                              Create customer
                            </Link>
                          ) : null}
                        </div>
                        <Typeahead
                          id="basic-typeahead-single"
                          filterBy={['names']}
                          labelKey="names"
                          onChange={setCustomer}
                          options={customers}
                          placeholder="customer name ..."
                          selected={customer}
                        />
                      </div>
                      <div className="pt-2 mt-1">
                        <CFormLabel htmlFor="affiliations">
                          Affiliated to
                        </CFormLabel>
                        <CFormSelect
                          name="affilation"
                          id="affiliation"
                          className="mb-3"
                          {...register('affiliationId')}
                        >
                          <option></option>
                          {customers && customers.length !== 0
                            ? customers
                                .filter(
                                  (cust) => cust.customerType === 'company',
                                )
                                .map((com, i) => (
                                  <option value={com.id} key={com.names + i}>
                                    {com.names}
                                  </option>
                                ))
                            : null}
                        </CFormSelect>
                      </div>
                    </CCol>
                    <CCol md={6} className="d-flex">
                      <div className="col">
                        <CFormLabel htmlFor="checkIn" className="d-block">
                          Dates In
                        </CFormLabel>
                        <DatePicker
                          className="form-control"
                          multiple
                          highlightDates={datesIn}
                          minDate={new Date()}
                          dateFormat="dd/MM/yyyy"
                          onChange={(date) => {
                            let newDates = [...datesIn, new Date(date)]
                            newDates = filterDateDuplicates(newDates)
                            setDatesIn([...newDates])
                          }}
                          inline
                          excludeDates={[...removeDates]}
                          placeholderText="Select a date other than  yesterday"
                        />
                      </div>
                      {datesIn.length !== 0 ? (
                        <div>
                          <p className=" text-center ">Reservation Dates</p>
                          {datesIn.map((current, i) => (
                            <div key={i * 3456}>
                              <li>
                                {new Date(current).toLocaleDateString('fr-FR')}{' '}
                              </li>
                              <p
                                className="text-danger"
                                onClick={() => {
                                  let newDatesIn = datesIn.filter(
                                    (el) => el !== current,
                                  )
                                  return setDatesIn(newDatesIn)
                                }}
                              >
                                Remove
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </CCol>

                    {type &&
                    type === 'room' &&
                    customer &&
                    customer.length !== 0 &&
                    customer[0].customerType !== 'company' ? (
                      <div className="row my-2 text-center">
                        <div>
                          <CFormLabel htmlFor="additionalInfo">
                            Additional Info
                          </CFormLabel>
                        </div>
                        <div>
                          <div className="d-flex flex-row justify-content-around my-2">
                            <div>
                              <CFormInput
                                type="text"
                                id="adults_number"
                                label="Adults number"
                                {...register('adults_number')}
                              />
                            </div>
                            <div>
                              <CFormInput
                                type="text"
                                id="adults_number"
                                label="Children number"
                                {...register('children_number')}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className="d-flex flex-row my-2 ">
                      <strong> Total </strong>
                      <p className="mx-2">
                        {datesIn.length !== 0
                          ? Number(priceRoom) * datesIn.length +
                            '  USD  /  ' +
                            Number(
                              localExchangeRate *
                                Number(priceRoom) *
                                datesIn.length,
                            ).toLocaleString() +
                            ' RWF'
                          : Number(priceRoom) + '  USD'}
                      </p>
                      {details && type === 'room' ? (
                        <p>
                          {' '}
                          {Number(
                            datesIn.length * totalPrice,
                          ).toLocaleString()}{' '}
                          USD RWF /{'  '}
                          {apicurrencies && apicurrencies.length !== 0
                            ? Number(
                                localExchangeRate *
                                  Number(datesIn.length * totalPrice),
                              ).toLocaleString()
                            : null}{' '}
                          RWF
                        </p>
                      ) : null}
                    </div>

                    <CCol md={6}>
                      <CFormLabel htmlFor="paymentMethod">Payment</CFormLabel>
                      <CFormInput
                        name="payment"
                        id="payment"
                        type="text"
                        className="mb-3"
                        min={0}
                        defaultValue={0}
                        {...register('payment')}
                      />
                    </CCol>
                    <CCol md={6} className="d-flex gap-2">
                      <div className="col">
                        <CFormLabel htmlFor="paymentMethod">
                          Payment method
                        </CFormLabel>
                        <CFormSelect
                          name="paymentMethod"
                          id="paymentMethod"
                          className="mb-3"
                          {...register('paymentMethod')}
                        >
                          <option value="Cash">Cash</option>
                          <option value="Mobile Money">Mobile Money</option>
                          <option value="Credit card">Credit card</option>
                          <option value="Credit">Credit</option>
                          <option value="Cheque">Cheque</option>
                        </CFormSelect>
                      </div>
                      <div className="col">
                        <CFormLabel htmlFor="paymentCurrency">
                          Currency
                        </CFormLabel>
                        <CFormSelect
                          name="paymentMethod"
                          id="currency"
                          className="mb-3"
                          defaultValue={'RWF'}
                          {...register('currency')}
                        >
                          {Object.keys(currencies).map((curr, i) => (
                            <option value={curr} key={i + 1}>
                              {curr} :{currencies[curr]}{' '}
                            </option>
                          ))}
                        </CFormSelect>
                      </div>
                    </CCol>
                  </CCardBody>
                </div>

                <CCol xs={12}>
                  <CButton
                    component="input"
                    type="submit"
                    className={`${
                      loggedInUser === 'controller' ||
                      customer.length === 0 ||
                      dontSubmit ||
                      (!service && service.length === 0)
                        ? 'disabled'
                        : ''
                    } `}
                    value="Check In "
                  />
                </CCol>

                {payment < 0 ? (
                  <p className="text-danger ">Paymen can not be negative</p>
                ) : null}
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </React.Fragment>
  )
}

export default RoomCheckin
