import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Typeahead } from 'react-bootstrap-typeahead'
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

const ReservationAdd = () => {
  const { register, handleSubmit, watch, reset } = useForm()
  const [customer, setCustomer] = useState([])
  const [service, setService] = useState([])
  const [rooms, setRooms] = useState([])
  const [halls, setHalls] = useState([])
  const [hallServices, setHallServices] = useState([])
  const [RoomClasses, setRoomClasses] = useState([])
  let [customers, setCustomers] = useState([])
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [visible, setVisible] = useState(false)

  let loggedInUser = useSelector((state) => state.auth.user.Role.name)
  let user = useSelector((state) => state.auth.user)
  let priceHall = 0
  let priceRoom = 0

  const type = watch('booking_type') || '---'
  const additional = watch('additionalServices') || {}
  const roomK = watch('roomClass') || null
  const details = watch('details') || null

  const additionalTotal =
    Object.keys(additional).length !== 0
      ? Object.keys(additional).map((e) =>
          additional[e] != false ? Number(additional[e]) : 0,
        )
      : [0]
  const additionalServicesTotal = additionalTotal.reduce((a, b) => a + b) || 0
  let all = []
  all = type && type === 'room' ? [...rooms] : [...halls]

  if (type === 'hall' && service.length !== 0) {
    priceHall = service[0].price
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
  const handleSearch = (query) => {
    const filteredOptions = customers.filter((option) =>
      option.name.toLowerCase().includes(query.toLowerCase()),
    )
    setCustomers(filteredOptions)
  }

  const onSubmit = (data) => {
    if (type === 'room' && days && !roomK) {
      data.roomId = service[0].id
      data.amount = service[0].RoomClass.price * days
    } else if (type === 'room' && days && roomK && roomK.length !== 0) {
      data.amount = totalPrice.reduce((a, b) => a + b) * days
      delete data.roomClass
    } else if (days) {
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
        .catch(() => {
          toast.error('Rerservation add failed')
        })

      setCustomer([])
      setService([])
    }
    createReservation()
    reset()
  }

  useEffect(() => {
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
      await instance
        .get('/halls/all')
        .then((res) => {
          setHalls(res.data.data)
        })
        .catch((err) => {
          console.log(err.message)
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
    getRoomClasses()
    getRooms()
    getHalls()
    getHallServices()
    getCustomers()
  }, [reload])

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
                name="roomClassAddFrm"
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
                        size="md"
                        className="mb-3"
                        {...register('booking_type')}
                      >
                        <option>---</option>
                        <option value="room">Room</option>
                        <option value="hall">Hall</option>
                      </CFormSelect>
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel htmlFor="service"> Service </CFormLabel>

                      <Typeahead
                        id="basic-typeahead-single"
                        labelKey="name"
                        filterBy={['name']}
                        onChange={setService}
                        options={all}
                        placeholder="service  ..."
                        selected={service}
                      />
                    </CCol>

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
                          placeholderText="Select a date other than today or yesterday"
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
                                        id="service 1"
                                        value={hallService.price}
                                        label={
                                          hallService.name +
                                          ' ' +
                                          hallService.price +
                                          ' RWF'
                                        }
                                        {...register(
                                          `additionalServices.${hallService.name}`,
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
                    customer.length !== 0 &&
                    customer[0].customerType === 'company' ? (
                      <div className="row my-2 ">
                        <div className="my-2">
                          <CFormLabel
                            htmlFor="additionalInfo"
                            className="fw-bolder "
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

                    {customer &&
                    customer.length !== 0 &&
                    customer[0].customerType === 'company' &&
                    type &&
                    type === 'room'
                      ? RoomClasses && RoomClasses.length !== 0
                        ? RoomClasses.map((roomClass) => (
                            <CCol>
                              <CFormLabel className="fw-bold pe-3">
                                {roomClass.name +
                                  ' rooms at ' +
                                  roomClass.price +
                                  'USD'}
                              </CFormLabel>
                              <CFormCheck
                                className=""
                                id="room class 1 roooms "
                                value={roomClass.name}
                                {...register('roomClass')}
                              />
                              <p>
                                Number of available rooms <span></span>
                              </p>
                              {roomK && roomK.includes(roomClass.name) ? (
                                <CFormInput
                                  type="number"
                                  id="number of people"
                                  label="Number of people"
                                  {...register(
                                    `details.${roomClass.name}.people`,
                                  )}
                                />
                              ) : null}
                            </CCol>
                          ))
                        : null
                      : null}

                    <div className="d-flex flex-row my-2 ">
                      <strong> Total </strong>
                      <p className="mx-2">
                        {type === 'room' && !roomK
                          ? type === 'room' && service.length !== 0
                            ? Number(priceRoom) * days + '  USD'
                            : Number(priceRoom) + '  USD'
                          : ''}
                        {type === 'hall'
                          ? type === 'hall' && service.length !== 0
                            ? Number(priceHall) * days +
                              additionalServicesTotal +
                              '  RWF'
                            : additionalServicesTotal + '  RWF'
                          : ''}

                        {type === 'room' &&
                        details &&
                        roomK &&
                        roomK.length !== 0
                          ? RoomClasses.map((e, i) => {
                              if (roomK.includes(e.name)) {
                                totalPrice.push(
                                  Number(e.price) *
                                    Number(details[e.name].people),
                                )

                                if (i === roomK.length - 1) {
                                  return (
                                    totalPrice.reduce((a, b) => a + b) * days +
                                    ' USD'
                                  )
                                }
                              } else {
                                return null
                              }
                            })
                          : null}
                      </p>
                    </div>

                    <CCol md={6}>
                      <CFormLabel htmlFor="paymentMethod">Payment</CFormLabel>
                      <CFormInput
                        name="payment"
                        id="payment"
                        type="text"
                        size="md"
                        className="mb-3"
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
                          size="md"
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
                          size="md"
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
                      service === 0
                        ? 'disabled'
                        : ''
                    } `}
                    value="Book now"
                  />
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </React.Fragment>
  )
}

export default ReservationAdd
