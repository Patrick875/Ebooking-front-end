import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
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
} from '@coreui/react'
import ReactToPrint from 'react-to-print'
import PrintTemplate1 from '../Printing/PrintTemplate1'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import ServiceSells from './ServiceSells'
import { Link, useLocation } from 'react-router-dom'
import { BsFiles } from 'react-icons/bs'

function ServiceReceipt(props) {
  const { client, service, data } = props

  return (
    <CCard>
      <CCardBody>
        <CForm
          className="row"
          name="serviceSellViewFrm"
          encType="multipart/form"
        >
          <div className="mb-4">
            <CCardBody className="row">
              <CCol md={6}>
                <CFormLabel className="fw-bolder"> Customer details</CFormLabel>
                <div>
                  <CFormLabel> Names</CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="client_name"
                    id="client_name"
                    required
                    value={client.names}
                  />
                  <CFormLabel>Phone</CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={client.phone}
                  />
                </div>
              </CCol>
              <CCol md={6}>
                <CFormLabel className="fw-bolder">Service details</CFormLabel>
                <div>
                  <p className="font-weight-bold">Service : {service.name}</p>
                  <p className="font-weight-bold">Times : {data.times}</p>
                  <p className="font-weight-bold">
                    Total :{' '}
                    {Number(data.times * service.price).toLocaleString()}
                  </p>
                  <p className="font-weight-bold">
                    Date : {new Date().toLocaleString()}
                  </p>
                </div>
              </CCol>
            </CCardBody>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

const ServiceSell = React.forwardRef((props, ref) => {
  const { handleSubmit, register, watch, getValues } = useForm()
  const componentRef = useRef()
  const formData = getValues()
  const times = watch('times') || 1
  const location = useLocation()?.pathname
  const department = location ? location.split('/').pop() : null
  const departmentSearchString = department
    ? department.includes('-')
      ? department.split('-')[0]
      : department
    : ''
  const [singleSelections, setSingleSelections] = useState([])
  let [services, setServices] = useState([])
  const [customers, setCustomers] = useState([])
  let [sells, setSells] = useState([])
  const [customer, setCustomer] = useState([])
  const onServiceSell = async (data) => {
    data.serviceId =
      singleSelections && singleSelections.length !== 0
        ? singleSelections[0].id
        : null
    data.service_categoryId =
      singleSelections && singleSelections.length !== 0
        ? singleSelections[0].service_categoryId
        : null
    data.client_name =
      customer && customer.length !== 0
        ? customers.includes(customer[0])
          ? customer[0].names
          : customer[0]
        : null
    data.customer =
      customer && customer.length !== 0
        ? customers.includes(customer[0])
          ? customer[0].id
          : null
        : null

    data = Object.keys(data).reduce((acc, key) => {
      if (data[key] !== null) {
        acc[key] = data[key]
      }
      return acc
    }, {})
    await instance
      .post('/services/sell', data)
      .then(() => {
        toast.success('service sold')
      })
      .catch(() => {
        toast.error('service sell failed')
      })
  }
  if (departmentSearchString !== '') {
    services =
      services && services.length !== 0
        ? services.filter((service) =>
            service.ServiceCategory.name
              .toLowerCase()
              .startsWith(departmentSearchString),
          )
        : services

    sells =
      sells && sells.length !== 0
        ? sells.filter((sell) =>
            sell.ServiceCategory.name
              .toLowerCase()
              .startsWith(departmentSearchString)
              ? sell
              : null,
          )
        : sells
  }

  useEffect(() => {
    const getAllServices = async () => {
      await instance
        .get('/services/all')
        .then((res) => {
          if (res.status === 200) {
            setServices(res.data.data)
          }
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    const getAllCustomers = async () => {
      await instance.get('/customers/all').then((res) => {
        setCustomers(res.data.data)
      })
    }
    const getAllSells = async () => {
      await instance.get('/services/sells').then((res) => {
        setSells(res.data.data)
      })
    }
    getAllSells()
    getAllCustomers()
    getAllServices()
  }, [])

  return (
    <div className="mt-0">
      <p className="fs-3 text-uppercase my-0 py-0 text-center">{department}</p>
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader className="py-0 my-0 d-flex justify-content-between">
              <p className="fs-5 fw-bold">Checkout service</p>
              {Number(times) < 0 ||
              customer.length === 0 ||
              singleSelections.length === 0 ? null : (
                <ReactToPrint
                  trigger={() => (
                    <button className="btn btn-ghost-primary">Print</button>
                  )}
                  content={() => ref || componentRef.current}
                />
              )}
            </CCardHeader>
            <CCardBody className="py-0 my-0">
              <CForm
                className="row"
                name="serviceSellFrm"
                encType="multipart/form"
                onSubmit={handleSubmit(onServiceSell)}
              >
                <CCol md={6} className="py-0 my-0">
                  <CFormLabel htmlFor="title"> Client name </CFormLabel>
                  <Typeahead
                    id="basic-typeahead-single"
                    labelKey="names"
                    onChange={setCustomer}
                    options={customers}
                    placeholder="search client"
                    selected={customer}
                  />
                </CCol>

                <CCol md={6} className="py-0 my-0">
                  <CFormLabel htmlFor="title"> Service name </CFormLabel>
                  <Typeahead
                    id="basic-typeahead-single"
                    labelKey="name"
                    onChange={setSingleSelections}
                    options={services}
                    placeholder="search service..."
                    selected={singleSelections}
                  />
                </CCol>
                <CCol md={6} className="py-0 my-0">
                  <CFormLabel htmlFor="times"> Times </CFormLabel>
                  <CFormInput
                    type="number"
                    name="times"
                    id="times"
                    defaultValue={1}
                    min={0}
                    {...register('times')}
                  />
                </CCol>
                <CCol md={6} className="py-0 my-0">
                  <CFormLabel htmlFor="paymentMethod">
                    {' '}
                    Payment method{' '}
                  </CFormLabel>
                  <CFormSelect
                    name="paymentMethod"
                    id="paymentMethod"
                    {...register('paymentMethod')}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Credit card">Credit card</option>
                  </CFormSelect>
                </CCol>
                <CFormLabel className="d-flex my-3 flex-col">
                  Total :{' '}
                  <strong className="px-2">
                    {singleSelections && singleSelections.length !== 0
                      ? Number(
                          singleSelections[0].price * times,
                        ).toLocaleString()
                      : 0}{' '}
                    RWF
                  </strong>
                </CFormLabel>
                <CCol xs={12} className="text-center mb-3">
                  <CButton
                    component="input"
                    type="submit"
                    value="Check out"
                    disabled={
                      Number(times) < 0 ||
                      customer.length === 0 ||
                      singleSelections.length === 0
                    }
                  />
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
          <div className="d-flex justify-content-between my-2">
            <p className="fs5 fw-bold">Latest sales</p>
            <Link
              md={4}
              className="btn btn-primary"
              to={`/booking/services/${department}/allSells`}
            >
              <BsFiles className="fs-5" /> All Sells
            </Link>
          </div>
          <CCard>
            <ServiceSells sells={sells} />
          </CCard>

          {Number(times) < 0 ||
          customer.length === 0 ||
          singleSelections.length === 0 ? null : (
            <div style={{ display: 'none' }}>
              <PrintTemplate1
                ref={ref || componentRef}
                title={`${department.toLocaleUpperCase()} receipt`}
              >
                <ServiceReceipt
                  service={singleSelections[0]}
                  client={customer[0]}
                  data={formData}
                />
              </PrintTemplate1>
            </div>
          )}
        </CCol>
      </CRow>
    </div>
  )
})

export default ServiceSell
