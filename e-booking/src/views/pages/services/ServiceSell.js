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

function ServiceSell() {
  const { handleSubmit } = useForm()
  const [singleSelections, setSingleSelections] = useState([])
  const [services, setServices] = useState([])
  const [customers, setCustomers] = useState([])
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
    getAllCustomers()
    getAllServices()
  }, [])

  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h2 className="text-center">
                <strong> Checkout service </strong>
              </h2>
            </CCardHeader>
            <CCardBody>
              <CForm
                className="row"
                name="roomClassAddFrm"
                encType="multipart/form"
                onSubmit={handleSubmit(onServiceSell)}
              >
                <CCol md={6}>
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

                <CCol md={6}>
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

                <CCol xs={12} className="text-center my-3">
                  <CButton component="input" type="submit" value="Check out" />
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default ServiceSell
