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
import { getAllRemoveDates } from 'src/utils/functions'
import CalendarContainer from 'src/utils/CalendarContainer'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'
import { currencies } from 'src/utils/constants'
import CustomerAdd from '../Customer/CustomerAdd'

const CreateCustomerModal = (props) => {
  const { visible, setVisible, reload } = props
  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={() => setVisible(false)}
      size="lg"
    >
      <CustomerAdd reload={reload} />
    </CModal>
  )
}

const ReservationAdd = (props) => {
  const { register, handleSubmit, watch, reset } = useForm()
  const [customer, setCustomer] = useState([])
  const [service, setService] = useState([])
  const [rooms, setRooms] = useState([])
  const [halls, setHalls] = useState([])
  const [hallServices, setHallServices] = useState([])
  let [RoomClasses, setRoomClasses] = useState([])
  let [customers, setCustomers] = useState([])
  let [apicurrencies, setApiCurrencies] = useState([])
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [visible, setVisible] = useState(false)

  let loggedInUser = useSelector((state) => state.auth.user.Role.name)
  let user = useSelector((state) => state.auth.user)
  let priceHall = 0
  let priceRoom = 0

  const type = watch('booking_type') || 'room'
  const additional = watch('additionalServices') || {}
  const roomK = watch('roomClass') || null
  const details = watch('details') || null
  const payment = watch('payment') || 0

  const dontSubmit =
    !service || service.length === 0 || payment < 0 ? true : false

  const additionalTotal =
    Object.keys(additional).length !== 0
      ? Object.keys(additional).map((e) =>
          additional[e] != false ? Number(additional[e]) : 0,
        )
      : [0]
  const additionalServicesTotal = additionalTotal.reduce((a, b) => a + b) || 0

  if (type === 'hall' && service.length !== 0) {
    priceHall = service && service.length !== 0 ? service[0].price : 0
  } else if (type === 'room' && service.length !== 0 && service[0].RoomClass) {
    priceRoom = service[0].RoomClass.price
  }
  const time =
    new Date(startDate).getTime() !== 0 && new Date(endDate).getTime() !== 0
      ? new Date(endDate).getTime() - new Date(startDate).getTime()
      : null
  const days = Math.ceil(time / (1000 * 3600 * 24)) || 1

  let totalPrice = []
  const removeDates =
    service && service.length !== 0 ? getAllRemoveDates(service[0]) : []
  const [reload, setReload] = useState()
  RoomClasses =
    RoomClasses && RoomClasses.length !== 0 && rooms && rooms.length !== 0
      ? RoomClasses.map(({ id, name, price }) => {
          return { id: id, name: name, price: price }
        })
      : RoomClasses
  props = { ...props }
  props.renderMenuItemChildren = (option, { text }) => (
    <div>
      <Highlighter search={text}>
        {option.name + ' : ' + option.RoomClass.name}
      </Highlighter>
    </div>
  )

  const onSubmit = (data) => {
    if (type === 'room' && days && !details) {
      data.roomId = service[0].id
      data.amount = service[0].RoomClass.price * days
    } else if (type === 'room' && days && roomK && roomK.length !== 0) {
      data.amount = totalPrice
      delete data.roomClass
    } else if (days && !details) {
      data.hallId = service[0].id
      data.amount = priceHall * days + additionalServicesTotal
      delete data.children_number
      delete data.adults_number
    }
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
    }
    data = { ...data, status: 'in progress' }
    const createReservation = async () => {
      await instance
        .post('/reservation/add', data)
        .then((res) => {
          toast.success('Reservation added')
          setReload(res)
        })
        .catch((err) => {
          toast.error('Rerservation add failed')
        })

      setCustomer([])
      setService([])
    }
    createReservation()
    reset()
  }
  useEffect(() => {
    const getCurrencyRates = async () => {
      await instance.get('/currency/rate').then((res) => {
        setApiCurrencies([...apicurrencies, res.data.data])
      })
    }
    const getCustomers = async () => {
      await instance
        .get('/customers/all')
        .then((res) => {
          setCustomers(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    const getRooms = async () => {
      await instance
        .get('/room/all')
        .then((res) => {
          setRooms(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    const getHallServices = async () => {
      await instance
        .get('/hall/services/all')
        .then((res) => {
          setHallServices(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    const getHalls = async () => {
      await instance.get('/halls/all').then((res) => {
        setHalls(res.data.data)
      })
    }

    const getRoomClasses = async () => {
      await instance
        .get('/roomclass/all')
        .then((res) => {
          setRoomClasses(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getCurrencyRates()
    getRoomClasses()
    getRooms()
    getHalls()
    getHallServices()
    getCustomers()
  }, [reload])

  const calculateTotal = (info) => {
    let roomKlasses = []
    let cals = []
    if (info && Object.keys(info).length !== 0) {
      roomKlasses.push(Object.keys(info))
      if (
        RoomClasses &&
        RoomClasses.length !== 0 &&
        info &&
        roomKlasses.length !== 0
      ) {
        cals = RoomClasses.filter((el) => roomKlasses[0].includes(el.name))
        if (cals.length !== 0) {
          totalPrice = cals.reduce(
            (acc, b) => acc + Number(b.price * info[b.name].people * days),
            0,
          )
          return totalPrice
        }
        return 0
      }
      return 0
    }
    return 0
  }
  totalPrice = calculateTotal(details)
  return (
    <React.Fragment>
      <CreateCustomerModal
        visible={visible}
        setVisible={setVisible}
        reload={reload}
      />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h5>
                <strong> Create reservation </strong>
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
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel htmlFor="type">Hall/Room</CFormLabel>
                      <CFormSelect
                        name="booking"
                        id="booking"
                        className="mb-3"
                        {...register('booking_type')}
                      >
                        <option value="room" selected>
                          Room
                        </option>
                        <option value="hall">Hall</option>
                      </CFormSelect>
                    </CCol>

                    {type &&
                    type === 'room' &&
                    customer &&
                    customer.length !== 0 &&
                    customer[0].customerType === 'company' ? null : (
                      <CCol md={6} disabled={true}>
                        <CFormLabel htmlFor="service"> Service </CFormLabel>
                        {type && type === 'room' ? (
                          <Typeahead
                            id="rooms"
                            labelKey="name"
                            filterBy={['name']}
                            onChange={setService}
                            options={rooms}
                            placeholder="service  ..."
                            selected={service}
                            {...props}
                          />
                        ) : (
                          <Typeahead
                            id="halls"
                            labelKey="name"
                            filterBy={['name']}
                            onChange={setService}
                            options={halls}
                            placeholder="service  ..."
                            selected={service}
                          />
                        )}
                      </CCol>
                    )}

                    <CCol md={6} className="d-flex flex-col ">
                      <div className="col-4 mx-2">
                        <CFormLabel htmlFor="checkIn" className="d-block">
                          Check-in
                        </CFormLabel>
                        <DatePicker
                          className="form-control"
                          onChange={(date) => setStartDate(date)}
                          selected={startDate}
                          minDate={new Date()}
                          portalId="root-portal"
                          showTimeSelect
                          timeIntervals={60}
                          dateFormat="dd/MM/yyyy"
                          popperPlacement="bottom-end"
                          popperContainer={CalendarContainer}
                          excludeDates={[...removeDates]}
                          placeholderText="Select a date other than today or yesterday"
                        />
                      </div>
                      <div className=" mx-2 col-4">
                        <CFormLabel htmlFor="checkIn" className="d-block">
                          Check-out
                        </CFormLabel>
                        <DatePicker
                          className="form-control"
                          selected={endDate}
                          showTimeSelect
                          timeFormat="p"
                          minDate={new Date()}
                          dateFormat="dd/MM/yyyy"
                          timeIntervals={60}
                          popperPlacement="bottom-end"
                          onChange={(date) => setEndDate(date)}
                          excludeDates={[...removeDates]}
                          placeholderText="Select a date other than  yesterday"
                        />
                      </div>
                    </CCol>

                    {type && type === 'hall' ? (
                      <div className="row my-2 text-center">
                        <div>
                          <CFormLabel htmlFor="additionalServices">
                            Additional products and services
                          </CFormLabel>
                        </div>
                        <div>
                          <div className="d-flex flex-row justify-content-around my-2">
                            <div>
                              {hallServices && hallServices.length !== 0
                                ? hallServices.map((hallService, i) => (
                                    <div className="d-flex flex-row">
                                      <CFormCheck
                                        id={`service ${i + 1}`}
                                        value={hallService.price}
                                        label={
                                          hallService.name.split(',')[0] +
                                          ' ' +
                                          hallService.price +
                                          ' RWF'
                                        }
                                        {...register(
                                          `additionalServices.${
                                            hallService.name.split(',')[0]
                                          }`,
                                        )}
                                      />
                                    </div>
                                  ))
                                : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

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

                    {customer &&
                    type &&
                    type !== 'room' &&
                    customer.length !== 0 &&
                    customer[0].customerType === 'company' ? (
                      <div className="row my-2 ">
                        <div className="my-2">
                          <CFormLabel
                            htmlFor="additionalInfo"
                            className="fw-bolder text-center"
                          >
                            Booking for company
                          </CFormLabel>
                        </div>
                        <div>
                          <div className="d-flex flex-row  my-2">
                            <div>
                              <CFormInput
                                type="text"
                                id="adults_number"
                                label="Number of people"
                                {...register('number_of_people')}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <CRow>
                      {customer &&
                      customer.length !== 0 &&
                      customer[0].customerType === 'company' &&
                      type &&
                      type === 'room'
                        ? RoomClasses && RoomClasses.length !== 0
                          ? RoomClasses.map((roomClass) => (
                              <CCol md={6}>
                                {roomClass.name}
                                <CFormInput
                                  type="number"
                                  min={0}
                                  id={`"number of people" for ${roomClass.name}`}
                                  {...register(
                                    `details.${roomClass.name}.people`,
                                  )}
                                />
                              </CCol>
                            ))
                          : null
                        : null}
                    </CRow>

                    <div className="d-flex flex-row my-2 ">
                      <strong> Total </strong>
                      <p className="mx-2">
                        {type === 'room' && !details
                          ? type === 'room' && service.length !== 0
                            ? Number(priceRoom) * days +
                              '  USD  /  ' +
                              Number(
                                apicurrencies[0].filter(
                                  (el) => el.name === 'RWF',
                                )[0].rate *
                                  Number(priceRoom) *
                                  days,
                              ).toLocaleString() +
                              ' RWF'
                            : Number(priceRoom) + '  USD'
                          : ''}
                        {type === 'hall'
                          ? type === 'hall' && service.length !== 0
                            ? Number(priceHall) * days +
                              additionalServicesTotal +
                              '  RWF'
                            : additionalServicesTotal + '  RWF'
                          : ''}
                      </p>
                      {details && type === 'room' ? (
                        <p>
                          {' '}
                          {totalPrice.toLocaleString()} USD RWF /{'  '}
                          {apicurrencies && apicurrencies.length !== 0
                            ? Number(
                                apicurrencies[0].filter(
                                  (el) => el.name === 'RWF',
                                )[0].rate * totalPrice,
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
                      service === 0
                        ? 'disabled'
                        : ''
                    } `}
                    value="Book now"
                  />
                </CCol>
                {!service || service.length === 0 ? (
                  <p className="text-danger ">Please select service</p>
                ) : null}
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

export default ReservationAdd
