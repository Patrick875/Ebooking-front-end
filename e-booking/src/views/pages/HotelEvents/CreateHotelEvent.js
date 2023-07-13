import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  CCard,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CRow,
} from '@coreui/react'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'

import BackButton from 'src/components/Navigating/BackButton'
import DatePicker from 'react-datepicker'
import { v4 as uuidv4 } from 'uuid'
import { initialRowsEvents } from 'src/utils/constants'
import { removeObjectsWithEmptyProperties } from 'src/utils/functions'

import EditableTableEvents from 'src/components/EditableTableEvents'

const CreateHotelEvent = (props) => {
  const { name, id, setCreate, halls } = props
  const { register, watch } = useForm()
  const clientData = watch('outside')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  let [requestItems, setRequestItems] = useState([...initialRowsEvents])
  const [created, setCreated] = useState({})

  const createEvent = async (data) => {
    await instance
      .post('/events/add', data)
      .then((res) => {
        if (res.data.data) {
          toast.success('Event created')
        }
        setCreated(res.data.data)
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }

  const submitRequest = () => {
    let data
    const outsideData = clientData
    requestItems = removeObjectsWithEmptyProperties(requestItems)
    requestItems = requestItems.map((el) => ({
      ...el,
    }))
    data = {
      ...outsideData,
      details: requestItems,
      startDate: new Date(startDate.toString()).getTime(),
      endDate: new Date(endDate.toString()).getTime(),
      pax: outsideData.pax,
      total: orderTotal,
    }
    createEvent(data)
  }

  const orderTotal =
    requestItems && requestItems.length !== 0
      ? requestItems.reduce(
          (a, b) => a + Number(b.quantity * b.days * b.price),
          0,
        )
      : 0

  return (
    <div>
      <div className="d-flex justify-content-between">
        <BackButton />
        <h5>
          <strong>
            {' '}
            {name} {id === 'catering' ? '' : 'Hall Event'}{' '}
          </strong>
        </h5>
      </div>
      <CRow>
        <CCol xs={12}>
          <div className="mb-4">
            <div className="d-flex gap-3">
              <p
                className="text-primary "
                onClick={() => {
                  setCreate(false)
                }}
              >
                Go back
              </p>
              <p
                className="text-primary"
                onClick={() =>
                  setRequestItems([
                    ...requestItems,
                    {
                      id: uuidv4(),
                      date: '',
                      name: '',
                      quantity: '',
                      times: '',
                      price: '',
                      comment: '',
                    },
                  ])
                }
              >
                Add row
              </p>
              {requestItems && requestItems.length !== 0 ? (
                <p
                  className="text-primary"
                  onClick={() => {
                    return setRequestItems([])
                  }}
                >
                  {' '}
                  Clear table
                </p>
              ) : null}

              {requestItems && requestItems.length !== 0 ? (
                <p
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    return submitRequest()
                  }}
                >
                  Submit
                </p>
              ) : null}
            </div>

            <CCard className="p-3">
              <CForm name="roomClassAddFrm" encType="multipart/form">
                <CRow>
                  <CCol md={6}>
                    <div>
                      <CFormLabel htmlFor="clientName"> Room </CFormLabel>
                      <CFormSelect
                        name="location"
                        id="location"
                        className="mb-3"
                        aria-label="Room"
                        {...register('outside.location', { required: true })}
                      >
                        {halls.map((el, i) => (
                          <option key={i * 13039} selected={el.name === name}>
                            {el.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor=" start date">
                      {' '}
                      From ( Start date){' '}
                    </CFormLabel>
                    <DatePicker
                      className="form-control"
                      timeFormat="p"
                      selected={startDate}
                      minDate={new Date()}
                      dateFormat="dd/MM/yyyy"
                      popperPlacement="bottom-end"
                      onChange={(date) => setStartDate(date)}
                      placeholderText="Select a date other than  yesterday"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="end date"> To ( End date)</CFormLabel>
                    <DatePicker
                      className="form-control"
                      selected={endDate}
                      timeFormat="p"
                      minDate={new Date()}
                      dateFormat="dd/MM/yyyy"
                      popperPlacement="bottom-end"
                      onChange={(date) => setEndDate(date)}
                      placeholderText="Select a date other than  yesterday"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="unit"> Client type </CFormLabel>
                    <CFormSelect
                      name="clientType"
                      id="clientType"
                      className="mb-3"
                      aria-label="client type"
                      {...register('outside.clientType', { required: true })}
                    >
                      <option value="COMPANY">COMPANY</option>
                      <option value="INDIVIDUAL">INDIVIDUAL</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={6}>
                    <div>
                      <CFormLabel htmlFor="clientName">
                        {' '}
                        Customer name{' '}
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        name="customerName"
                        id="customerName"
                        placeholder="...customer name"
                        required
                        {...register('outside.customerName')}
                      />
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div>
                      <CFormLabel htmlFor="startingTime">
                        {' '}
                        Starting Time{' '}
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        name="startingTime"
                        id="startingTime"
                        placeholder="...startingTime"
                        required
                        {...register('outside.startingTime')}
                      />
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div>
                      <CFormLabel htmlFor="Telephone"> Telephone </CFormLabel>
                      <CFormInput
                        type="text"
                        name="telephone"
                        id="telephone"
                        placeholder="...telephone"
                        required
                        {...register('outside.telephone')}
                      />
                    </div>
                  </CCol>
                  <CCol md={6} className="d-flex">
                    <div className="col">
                      <CFormLabel htmlFor="price"> Price per day </CFormLabel>
                      <CFormInput
                        type="number"
                        step="any"
                        name="price_per_day"
                        id="price_per_day"
                        placeholder="...price_per_day"
                        required
                        {...register('outside.price_per_day')}
                      />
                    </div>
                    <div className="col-4">
                      <CFormLabel htmlFor="currency"> Currency </CFormLabel>
                      <CFormSelect
                        name="currency"
                        id="currency"
                        className="mb-3"
                        aria-label="currency"
                        {...register('outside.currency', { required: true })}
                      >
                        <option value="RWF">RWF</option>
                        <option value="USD">USD</option>
                      </CFormSelect>
                    </div>
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel htmlFor="function"> Function </CFormLabel>
                    <CFormInput
                      type="text"
                      name="function"
                      id="function"
                      placeholder="...function"
                      required
                      {...register('outside.function')}
                    />
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel htmlFor="pax"> Pax </CFormLabel>
                    <CFormInput
                      type="number"
                      name="pax"
                      id="pax"
                      placeholder="...pax"
                      required
                      {...register('outside.pax')}
                    />
                  </CCol>
                </CRow>
              </CForm>
            </CCard>

            <CCard className="p-3">
              <EditableTableEvents
                data={[...requestItems]}
                setData={setRequestItems}
                readOnly={false}
              />
            </CCard>
          </div>
        </CCol>
      </CRow>
    </div>
  )
}

export default CreateHotelEvent
