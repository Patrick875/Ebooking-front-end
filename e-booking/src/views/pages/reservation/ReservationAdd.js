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
import {
  displayCustomerName,
  filterDateDuplicates,
  getAllDates,
} from 'src/utils/functions'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'
import { currencies } from 'src/utils/constants'
import CustomerAdd from '../Customer/CustomerAdd'

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

const ReservationAdd = (props) => {
  const { register, handleSubmit, watch, reset } = useForm()
  let [service, setService] = useState([])
  const [halls, setHalls] = useState([])
  let [customers, setCustomers] = useState([])
  const [visible, setVisible] = useState(false)
  const [newCustomer, setNewCustomer] = useState()
  let loggedInUser = useSelector((state) => state.auth.user.Role.name)
  let user = useSelector((state) => state.auth.user)
  let priceHall = service && service.length !== 0 ? service[0].price : 0

  const payment = watch('payment') || 0
  const customerId = watch('customerId')
  const [datesIn, setDatesIn] = useState([])

  const dontSubmit = payment < 0 ? true : false
  const removeDates =
    service && service.length !== 0 ? getAllDates(service[0]) : []
  const [reload, setReload] = useState()

  const onSubmit = (data) => {
    data.hallId = service[0].id
    data.amount = priceHall * datesIn.length

    data = {
      ...data,
      userId: user.id,
      status: 'in progress',
      datesIn: datesIn,
    }

    const createReservation = async () => {
      await instance
        .post('/reservation/add', data)
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

      setService([])
    }
    createReservation()
    reset()
    setDatesIn([])
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

    const getHalls = async () => {
      await instance.get('/halls/all').then((res) => {
        if (res && res.data && res.data.data) {
          setHalls(res.data.data)
        }
      })
    }

    getHalls()
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

                        <Link
                          className="d-block text-decoration-none"
                          onClick={() => setVisible(!visible)}
                        >
                          Create customer
                        </Link>
                      </div>

                      <CFormSelect {...register('customerId')}>
                        <option value=""></option>
                        {customers.length !== 0
                          ? customers.map((el) => (
                              <option key={el.id} value={el.id}>
                                {displayCustomerName(el)}
                              </option>
                            ))
                          : null}
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="service"> Hall </CFormLabel>
                      <Typeahead
                        id="halls"
                        labelKey="name"
                        filterBy={['name']}
                        onChange={setService}
                        options={halls}
                        placeholder="service  ..."
                        selected={service}
                      />
                    </CCol>

                    <CRow className="d-flex justify-content-between">
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
                            <div className="reservation-dates">
                              {datesIn.map((current, i) => (
                                <div key={i * 3456}>
                                  <li>
                                    {new Date(current).toLocaleDateString(
                                      'fr-FR',
                                    )}{' '}
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
                          </div>
                        ) : null}
                      </CCol>
                    </CRow>

                    <div className="d-flex flex-row my-2 ">
                      <strong> Total </strong>
                      <p className="mx-2">
                        {Number(priceHall * datesIn.length).toLocaleString() +
                          '  RWF'}
                      </p>
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
                      customerId === '' ||
                      dontSubmit ||
                      (!service && service.length === 0)
                        ? 'disabled'
                        : ''
                    } `}
                    value="Book now"
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

export default ReservationAdd
