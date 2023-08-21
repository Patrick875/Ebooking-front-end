import { CCol, CFormLabel, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import { Highlighter } from 'react-bootstrap-typeahead'
import { filterDateDuplicates, getAllDates } from 'src/utils/functions'
import {
  ebookingCreditCardValidYears,
  ebookingHours,
  ebookingMinutes,
  ebookingMonths,
} from 'src/utils/constants'
import { Link } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import { currencies } from 'src/utils/constants'
import { toast } from 'react-hot-toast'

function RoomEntry(props) {
  const [datesIn, setDatesIn] = useState([])
  const selectedRoom = useSelector((state) => state.reservation.selectedRoom)
  const {
    register,
    control,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm()
  const [customers, setCustomers] = useState([])
  let [selectedClient] = useState(null)
  const [revisiting, setRevisiting] = useState(false)
  const customer = watch('customer') || {}
  const currency = watch('currency') || 'RWF'

  const handleRevisitClient = (selectedClientId) => {
    selectedClient = customers.find(
      (customer) => customer.id === Number(selectedClientId),
    )
    if (selectedClient) {
      setValue('surname', selectedClient.surname)
      setValue('givenname', selectedClient.givenname)
      setValue('email', selectedClient.email)
      setValue('phone', selectedClient.phone)
      setValue('company', selectedClient.company)
      setValue('profession', selectedClient.profession)
      setValue('identification', selectedClient.identification)
      setValue('date_of_issue', selectedClient.date_of_issue)
      setValue('nationality', selectedClient.nationality)
      setValue('residence', selectedClient.residence)
      setValue('place_of_birth', selectedClient.place_of_birth)
    } else {
      setValue('surname', '')
      setValue('givenname', '')
      setValue('email', '')
      setValue('phone', '')
      setValue('company', '')
      setValue('profession', '')
      setValue('identification', '')
      setValue('date_of_issue', '')
      setValue('place_of_birth', '')
    }
  }

  const formatCreditCardNumber = (inputValue) => {
    return inputValue.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
  }
  const [cvv, setCVV] = useState('')
  const validYears = ebookingCreditCardValidYears()
  let [service, setService] = useState([])
  let [apicurrencies, setApiCurrencies] = useState([])
  const [creditCardNumber, setCreditCardNumber] = useState('')
  const [localExchangeRate, setLocalExchangeRate] = useState()
  const amount = selectedRoom.RoomClass.price * datesIn.length
  const removeDates =
    service && service.length !== 0 ? getAllDates(service[0]) : []

  const data = getValues()

  const submission = {
    ...data,
    customerId: selectedClient ? selectedClient.id : null,
    amount,
    payment: data.payment,
    currency,
    roomId: selectedRoom.id,
    forReservation: true,
    datesIn,
  }
  const url = selectedClient ? '/reservation/add' : '/reservation/add-immediate'
  const checkin = async () => {
    await instance
      .post(`${url}`, {
        ...submission,
        status: 'confirmed',
        roomStatus: 'occupied',
      })
      .then((res) => {
        if (res && res.data && res.data.data) {
          toast.success('Checked in !!!')
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
    console.log('submission', { ...submission, status: 'in progress' })
  }
  const reserve = async () => {
    await instance
      .post('/reservation/add-immediate', submission)
      .then((res) => {
        if (res && res.data && res.data.data) {
          toast.success('Checked in !!!')
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  props = { ...props }
  props.renderMenuItemChildren = (option, { text }) => (
    <div>
      <Highlighter search={text}>
        {option.name + ' : ' + option.RoomClass.name}
      </Highlighter>
    </div>
  )

  useEffect(() => {
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
    getCustomers()
    getCurrencyRates()
  }, [])

  return (
    <div>
      <h6 className="text-center">GUEST REGISTRATION FORM </h6>
      <CRow className="py-2">
        <CCol className="d-flex pb-2 " md={6}>
          <label htmlFor="room no" className="col">
            {' '}
            Rom No{' :'}
          </label>
          <input
            className="col-8"
            type="text"
            name="names"
            id="names"
            placeholder="room no"
            value={selectedRoom.name}
            required
            {...register('room', { required: true })}
          />
        </CCol>
        <CCol className="d-flex pb-2 " md={6}>
          <label htmlFor="adults" className="col">
            {' '}
            Adult (s) / Children{' :'}
          </label>
          <input
            className="col-4"
            name="adults"
            id="adults"
            type="number"
            required
            {...register('adults', { required: true })}
          />

          <input
            className="col-4"
            name="children"
            id="children"
            type="number"
            required
            {...register('children', { required: true })}
          />
        </CCol>
        <CCol className="d-flex pb-2  " md={6}>
          <label htmlFor="comming from" className="col">
            {' '}
            Comming from{' :'}
          </label>
          <input
            className="col-8"
            type="text"
            name="comming from"
            id="comming from"
            required
            {...register('commingFrom', { required: true })}
          />
        </CCol>
        <CCol className="d-flex  pb-2 " md={6}>
          <label htmlFor="Going to" className="col">
            {' '}
            Going To{' :'}
          </label>
          <input
            className="col-8"
            type="text"
            name="going to"
            id="going to"
            required
            {...register('goingTo', { required: true })}
          />
        </CCol>
        <CCol className="d-flex gap-2 pb-2" md={6}>
          <CFormLabel htmlFor="dates in" className="col-4">
            {' '}
            Dates In{' :'}
          </CFormLabel>
          <DatePicker
            className="col-12 ms-0 d-block"
            multiple
            highlightDates={datesIn}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            shouldCloseOnSelect={false}
            onChange={(date) => {
              let newDates = [...datesIn, new Date(date)]
              newDates = filterDateDuplicates(newDates)
              setDatesIn([...newDates])
            }}
            excludeDates={[...removeDates]}
            placeholderText={
              datesIn.length === 0
                ? 'Select date(s)'
                : new Date(
                    datesIn.sort((a, b) => new Date(a) - new Date(b))[0],
                  ).toLocaleDateString('fr-FR') +
                  ' - ' +
                  new Date(
                    datesIn.sort((a, b) => new Date(b) - new Date(a))[0],
                  ).toLocaleDateString('fr-FR')
            }
          >
            {datesIn.length !== 0 ? (
              <div>
                <p className=" text-center ">Reservation Dates</p>
                {datesIn.map((current, i) => (
                  <div
                    key={i * 3456}
                    className="d-flex justify-content-between"
                  >
                    <li>{new Date(current).toLocaleDateString('fr-FR')} </li>
                    <p
                      className="text-danger"
                      onClick={() => {
                        let newDatesIn = datesIn.filter((el) => el !== current)
                        return setDatesIn(newDatesIn)
                      }}
                    >
                      Remove
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </DatePicker>
        </CCol>
      </CRow>

      <div className="d-flex gap-3">
        <div>
          <label htmlFor="modeOfPayment">Mode of Payment</label>
        </div>
        <div className="col d-flex justify-content-between">
          <div className="d-flex gap-1">
            <input
              name="mode-cash"
              id="mode-cash"
              type="radio"
              {...register('paymentMode')}
              value="CASH"
            />
            <label htmlFor="mode-cash">CASH</label>
          </div>
          <div className="d-flex gap-1">
            <input
              name="mode-momo"
              id="mode-momo"
              type="radio"
              {...register('paymentMode')}
              value="MOMO"
            />
            <label htmlFor="mode-momo">MOMO</label>
          </div>
          <div className="d-flex gap-1">
            <input
              name="mode-cheque"
              id="mode-cheque"
              type="radio"
              {...register('paymentMode')}
              value="CHEQUE"
            />
            <label htmlFor="mode-cheque">CHEQUE</label>
          </div>
          <div className="d-flex gap-1">
            <input
              name="mode-credit"
              id="mode-credit"
              type="radio"
              {...register('paymentMode')}
              value="CREDIT"
            />
            <label htmlFor="mode-credit">CREDIT</label>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between my-1 py-1">
        <li className="text-decoration-none list-group">
          <Link
            className="text-decoration-none"
            to="#"
            onClick={() => {
              if (revisiting) {
                reset({ residence: '', surname: '' })
              }
              setRevisiting(!revisiting)
            }}
          >
            {!revisiting ? 'Revisiting client' : 'New client'}
          </Link>
        </li>
        {revisiting ? (
          <div className="d-flex gap-2">
            <label htmfor="revisit" className="col-7">
              Customer name
            </label>
            <select
              className="col"
              type="text"
              name="customerId"
              id="customerId"
              required
              onChange={(e) => handleRevisitClient(e.target.value)}
            >
              <option value=""></option>
              {customers &&
              customers.filter(
                (customer) => customer.givenname || customer.surname,
              ).length !== 0
                ? customers
                    .filter(
                      (customer) => customer.givenname || customer.surname,
                    )
                    .map((el, i) => (
                      <option
                        key={el * 900}
                        value={el.id}
                        className="text-uppercase"
                      >
                        {el.surname + ' ' + el.givenname}
                      </option>
                    ))
                : null}
            </select>
          </div>
        ) : null}
      </div>
      <div className="border border-bottom-1 border-dark col mt-my-1" />
      <CRow className="py-2">
        <CCol md={6} className="d-flex gap-2 pb-2">
          <label htmlFor="surname" className="col">
            {' '}
            Surname
          </label>
          <Controller
            type="text"
            name="surname"
            id="surname"
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} className="col-9" />}
          />
        </CCol>
        <CCol md={6} className="d-flex gap-2 pb-2">
          <label htmlFor="givenname" className="col">
            {' '}
            Given name
          </label>
          <Controller
            type="text"
            name="givenname"
            id="givenname"
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} className="col-9" />}
          />
        </CCol>
        <CCol md={6} className="d-flex gap-2 pb-2">
          <label htmlFor="birthplace" className="col">
            {' '}
            Place of birth{' '}
          </label>

          <Controller
            name="place_of_birth"
            id="place_of_birth"
            control={control}
            render={({ field }) => (
              <input
                className="col-9"
                name="place_of_birth"
                id="place_of_birth"
                {...field}
              />
            )}
          />
        </CCol>
        <CCol md={6} className="d-flex gap-2 pb-2">
          <label htmlFor="nationality" className="col">
            {' '}
            Nationality{' '}
          </label>

          <Controller
            name="nationality"
            id="nationality"
            control={control}
            render={({ field }) => (
              <input className="col-9" required {...field} />
            )}
          />
        </CCol>
        <CCol md={6} className="d-flex gap-2 pb-2">
          <label htmlFor="residence" className="col">
            {' '}
            Residence{' '}
          </label>
          <Controller
            name="residence"
            id="residence"
            control={control}
            render={({ field }) => (
              <input className="mb-1 col-9" required {...field} />
            )}
          />
        </CCol>
        <CCol md={6} className="d-flex gap-2 pb-2">
          <label htmlFor="bookedFrom" className="col">
            {' '}
            Booked from
          </label>
          <select
            className="col-9"
            type="text"
            name="bookedFrom"
            id="bookedFrom"
            required
            {...register('bookedFrom', { required: true })}
          >
            <option value=""></option>
            <option value="Booking.com">Booking.com</option>
            <option value="Corporate">Corporate</option>
            <option value="NGO">NGO</option>
            <option value="Embassy">Embassy</option>
            <option value="Direct">Direct</option>
            <option value="Tours">Tours</option>
          </select>
        </CCol>
        <CCol md={6} className="d-flex gap-2 pb-2">
          <label htmlFor="payment" className="col">
            {' '}
            Payment{' '}
          </label>
          <input
            className="col-9"
            name="payment"
            id="payment"
            type="number"
            required
            {...register('payment', { required: true })}
          />
        </CCol>
        <CCol md={6} className="d-flex gap-2 pb-2">
          <label htmlFor="currency" className="col">
            {' '}
            Currency{' '}
          </label>
          <select
            className="col-9"
            type="text"
            name="currency"
            id="currency"
            required
            {...register('currency', { required: true })}
          >
            {Object.keys(currencies).map((curr, i) => (
              <option value={curr} key={i + 1}>
                {curr} :{currencies[curr]}{' '}
              </option>
            ))}
          </select>
        </CCol>
      </CRow>

      <div className="d-flex justify-content-between">
        <div className="d-flex gap-2">
          <li className="text-decoration-none list-group">
            <Link className="text-decoration-none" to="#">
              Credit card
            </Link>
          </li>
          <li className="text-decoration-none list-group ">
            <Link className="text-decoration-none" to="#">
              Freight Details
            </Link>
          </li>
        </div>
        <div>
          <p>
            Total:{' '}
            {Number(
              selectedRoom.RoomClass.price * datesIn.length,
            ).toLocaleString()}{' '}
            USD /{' '}
            {Number(
              Math.round(
                Number(
                  selectedRoom.RoomClass.price *
                    datesIn.length *
                    localExchangeRate,
                ),
              ),
            ).toLocaleString()}{' '}
            RWF
          </p>
        </div>
      </div>

      <div className="d-flex  border border-primary rounded rounded-1  px-3 py-2 mb-2">
        <div className="col d-flex gap-2">
          <label htmlFor="card-number"> Card No: </label>
          <input
            id="card-number"
            type="text"
            {...register('creditCardDetails.creditCardNumber', {
              required: true,
              pattern: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
            })}
            maxLength={19}
            value={creditCardNumber}
            onChange={(e) => {
              const formattedValue = formatCreditCardNumber(e.target.value)
              setCreditCardNumber(formattedValue)
            }}
          />
          {errors.creditCardNumber && (
            <p className="error-message">Invalid credit card number</p>
          )}
        </div>
        <div className="col d-flex gap-2">
          <label htmlFor="cvc"> CVC: </label>
          <input
            type="text"
            name="cvc"
            id="cvc"
            maxLength={3}
            value={cvv}
            onChange={(e) => {
              const cleanedValue = e.target.value.replace(/\s/g, '')
              setCVV(cleanedValue)
            }}
          />
        </div>
        <div className="col d-flex gap-2">
          <label htmlFor="expiration"> Expiration: </label>
          <div className="col- d-flex gap-2 ">
            <select
              className="col-5"
              name="expiration-month"
              id="expiration-month"
              {...register('creditCardDetails.expiration-month')}
            >
              <option value=""></option>
              {ebookingMonths.map((el, i) => (
                <option key={i} value={el.name}>
                  {el.name}
                </option>
              ))}
            </select>

            {'/ '}

            <select
              className="col-5"
              name="expiration-year"
              id="expiration-year"
              {...register('creditCardDetails.expiration-year')}
            >
              <option value=""></option>
              {validYears.map((el, i) => (
                <option key={i} value={el}>
                  {el}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="d-flex  border border-primary rounded rounded-1  px-3 py-2 my-2">
        <div className="col d-flex gap-2">
          <label htmlFor="freight-No">Freight No: </label>
          <input
            type="text"
            name="freight-No"
            id="freight-No"
            {...register('freightDetails.freightNo')}
          />
        </div>
        <div className="col d-flex gap-2">
          <label htmlFor="freight-date"> Date: </label>
          <input
            type="text"
            name="freight-date"
            id="freight-date"
            {...register('freightDetails.date')}
          />
        </div>
        <div className="col d-flex">
          <label htmlFor="freight-time" className="col-6">
            {' '}
            Time (Hour/Min):
          </label>
          <div className="col-6 d-flex gap-2">
            <select
              {...register('freightDetails.freight-time-hour')}
              className="col-5"
              type="text"
              nname="freight-time-hour"
              id="freight-time-hour"
            >
              <option value=""></option>
              {ebookingHours.map((el, i) => (
                <option key={el + i} value={el}>
                  {el}
                </option>
              ))}
            </select>

            {': '}

            <select
              {...register('freightDetails.freight-time-minute')}
              className="col-5"
              type="text"
              nname="freight-time-minute"
              id="freight-time-minute"
            >
              <option value=""></option>
              {ebookingMinutes.map((el, i) => (
                <option key={el + i + 1} value={el}>
                  {el}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border border-bottom-1 border-dark col mt-1" />
      <CRow className="py-2">
        <CCol md={6} className="d-flex gap-2 pb-2">
          <label htmlFor="email" className="col">
            {' '}
            Email
          </label>

          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} className="col-9" />}
          />
        </CCol>
        <CCol md={6} className="d-flex gap-2 pb-2">
          <label htmlFor="telephone" className="col text-capitalize">
            {' '}
            telephone
          </label>

          <Controller
            name="phone"
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} className="col-9" />}
          />
        </CCol>
        <CCol md={6} className="d-flex gap-2 pb-2">
          <label htmlFor="company" className="col">
            {' '}
            Company
          </label>
          <Controller
            name="company"
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} className="col-9" />}
          />
        </CCol>
        <CCol md={6} className="d-flex gap-2 pb-2">
          <label htmlFor="profession" className="col">
            {' '}
            Profession
          </label>
          <Controller
            name="profession"
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} className="col-9" />}
          />
        </CCol>
        <CCol md={6} className="d-flex gap-2 pb-2">
          <label htmlFor="passport" className="col">
            {' '}
            Passport No
          </label>
          <Controller
            name="identification"
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} className="col-9" />}
          />
        </CCol>
        <CCol md={6} className="d-flex gap-2 pb-2">
          <label htmlFor="dateIssued" className="col">
            {' '}
            Date of Issue
          </label>
          <Controller
            name="date_of_issue"
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} className="col-9" />}
          />
        </CCol>
        <CCol md={6} className="d-flex gap-2 pb-2">
          <label htmlFor="other" className="col">
            {' '}
            Other note
          </label>
          <Controller
            name="other_note"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input {...field} {...register('other_note')} className="col-9" />
            )}
          />
        </CCol>
      </CRow>
      <div className="border border-bottom-1 border-dark col mt-2" />
      <div className="d-flex justify-content-around mt-2">
        <button
          className=" button-new shadow "
          onClick={() => {
            checkin()
          }}
        >
          Check in
        </button>
        <button
          className=" button-new shadow "
          onClick={() => {
            reserve()
          }}
        >
          Reserve
        </button>
      </div>
    </div>
  )
}

export default RoomEntry
