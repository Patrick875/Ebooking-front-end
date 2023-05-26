import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Typeahead } from 'react-bootstrap-typeahead'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormLabel,
  CRow,
} from '@coreui/react'

import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import ServiceSells from './ServiceSells'
import { Link, useLocation } from 'react-router-dom'
import { BsFiles } from 'react-icons/bs'

function ServiceSell() {
  const { handleSubmit } = useForm()
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

    // sells =
    //   services && services.length !== 0 && sells && sells.length !== 0
    //     ? sells.filter((sell) =>
    //         services.includes(sell.Service) ? sell : null,
    //       )
    //     : sells
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
            <CCardHeader className="py-0 my-0">
              <p className="text-center fs-5 fw-bold">Checkout service</p>
            </CCardHeader>
            <CCardBody className="py-0 my-0">
              <CForm
                className="row"
                name="roomClassAddFrm"
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
                  <CFormLabel className="d-flex my-3 flex-col">
                    Total :{' '}
                    <strong className="px-2">
                      {singleSelections && singleSelections.length !== 0
                        ? Number(singleSelections[0].price).toLocaleString()
                        : 0}{' '}
                      RWF
                    </strong>
                  </CFormLabel>
                </CCol>

                <CCol xs={12} className="text-center mb-3">
                  <CButton component="input" type="submit" value="Check out" />
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
          <div className="d-flex justify-content-between my-2">
            <p className="fs5 fw-bold">Latest sales</p>
            <Link
              md={4}
              className="btn btn-primary"
              to="/booking/services/allSells"
            >
              <BsFiles className="fs-5" /> All Sells
            </Link>
          </div>
          <CCard>
            <ServiceSells sells={sells} />
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default ServiceSell
