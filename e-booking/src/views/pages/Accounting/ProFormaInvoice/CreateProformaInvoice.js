import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CRow,
  CCollapse,
} from '@coreui/react'

import { toast } from 'react-hot-toast'
import ReactToPrint from 'react-to-print'
import { instance } from 'src/API/AxiosInstance'
import InvoiceList from '../Invoice/InvoiceList'
import InvoiceFooter from '../../Printing/InvoiceFooter'
import PrintTemplateInvoice from '../../Printing/PrintTemplateInvoice'
import BackButton from 'src/components/Navigating/BackButton'
import DatePicker from 'react-datepicker'
import ClientDetailsProForma from '../../Printing/ClientDetailsProForma'

const CreateProformaInvoice = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const documentTitle = 'Pro forma invoice'
  const { register, getValues, watch, reset } = useForm()
  const quantity = watch('quantity')
  const times = watch('times')
  const item = watch('name')
  const [visible, setVisible] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  let [requestItems, setRequestItems] = useState([])
  let [products, setProducts] = useState([])
  const [created, setCreated] = useState({})
  let request = {}

  const createInvoice = async (data) => {
    await instance
      .post('/proforma/add', data)
      .then((res) => {
        toast.success('Pro forma Invoice created')
        setCreated(res.data.data)
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }

  const dontAdd =
    !quantity ||
    quantity === '' ||
    Number(quantity) < 0 ||
    times === ' ' ||
    Number(times) < 0 ||
    !item ||
    item === ''
      ? true
      : false

  const onAdd = (data) => {
    setRequestItems([...requestItems, data])
    reset({ name: '', quantity: '', price: '', pax: '' })
  }
  const submitRequest = () => {
    let data
    const outsideData =
      requestItems && requestItems.length !== 0 ? requestItems[0].outside : {}
    requestItems = requestItems.map((requestItem) => {
      requestItem.unitPrice = requestItem.price
      delete requestItem.outside
      return { ...requestItem }
    })

    data = {
      ...outsideData,
      details: requestItems,
      dateIn: new Date(startDate.toString()).getTime(),
      dateOut: new Date(endDate.toString()).getTime(),
      VAT: requestItems[0].VAT,
    }
    createInvoice(data)
    reset()
  }

  let presentationProducts = []
  products =
    products && products.length !== 0
      ? products
          .filter((product) => product && product.Packages.length !== 0)
          .map((el) => {
            let newProducts = el.Packages.map((item) => ({
              name: item.name + ' of ' + el.name,
              price: item.ProductPackage.price,
            }))
            presentationProducts.push(...newProducts)
            return el
          })
      : products
  if (requestItems.length !== 0) {
    request = { ...request, createdAt: new Date() }
  }

  return (
    <div>
      <BackButton />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between">
                <h3>
                  <strong> Create Pro forma invoice</strong>
                </h3>
                <CButton
                  component="input"
                  value="Add items to list "
                  onClick={() => {
                    return setVisible(!visible)
                  }}
                />

                {requestItems && requestItems.length !== 0 ? (
                  <ReactToPrint
                    trigger={() => (
                      <button className="btn btn-ghost-primary">Print</button>
                    )}
                    content={() => ref || componentRef.current}
                  />
                ) : null}
              </div>
            </CCardHeader>
            <CCollapse visible={visible}>
              <CCardBody>
                <CForm name="roomClassAddFrm" encType="multipart/form">
                  <CRow>
                    <CCol md={6}>
                      <div>
                        <CFormLabel htmlFor="clientName">
                          {' '}
                          Client name{' '}
                        </CFormLabel>
                        <CFormInput
                          type="text"
                          name="clientName"
                          id="clientName"
                          placeholder="...client name"
                          required
                          {...register('outside.clientName')}
                        />
                      </div>
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
                        <CFormLabel htmlFor="function"> Function </CFormLabel>
                        <CFormInput
                          type="text"
                          name="function"
                          id="function"
                          placeholder="...function"
                          required
                          {...register('outside.function')}
                        />
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <div>
                        <CFormLabel htmlFor="pax"> Number of PAX </CFormLabel>
                        <CFormInput
                          type="number"
                          min={0}
                          defaultValue={1}
                          name="quantity"
                          id="quantity"
                          placeholder="...quantity"
                          required
                          {...register('quantity')}
                        />
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <div>
                        <CFormLabel htmlFor="itemName"> Item </CFormLabel>
                        <CFormInput
                          type="text"
                          name="itemName"
                          id="itemName"
                          placeholder=".. "
                          required
                          {...register('name')}
                        />
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="times"> Times</CFormLabel>
                      <CFormInput
                        type="number"
                        min={0}
                        defaultValue={1}
                        name="times"
                        id="times"
                        placeholder=".. "
                        required
                        {...register('times')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="price"> Price / unit </CFormLabel>
                      <CFormInput
                        type="number"
                        min={0}
                        name="price"
                        id="price"
                        placeholder="item price in RWF"
                        {...register('price')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="VAT"> VAT </CFormLabel>
                      <CFormSelect
                        name="VAT"
                        id="VAT"
                        className="mb-3"
                        aria-label="VAT"
                        {...register('VAT', { required: true })}
                      >
                        <option value="inclusive" selected>
                          Inclusive
                        </option>
                        <option value="exclusive">Exclusive</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="date of arrival">
                        {' '}
                        Expected date of Arrival{' '}
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
                      <CFormLabel htmlFor="date of departure">
                        {' '}
                        Expected date of Departure{' '}
                      </CFormLabel>
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
                  </CRow>
                  <CCol xs={12} className="mt-3">
                    <CButton
                      component="input"
                      value="Add item"
                      disabled={dontAdd}
                      onClick={() => {
                        const data = getValues()
                        return onAdd(data)
                      }}
                    />
                  </CCol>
                </CForm>
              </CCardBody>
            </CCollapse>
            <div style={{ display: 'none' }}>
              <PrintTemplateInvoice ref={ref || componentRef}>
                {created ? (
                  <React.Fragment>
                    <p className="text-center my-3 text-uppercase fw-bold">
                      Pro forma Invoice N &#176;{created.proformaGenerated}
                    </p>
                    <ClientDetailsProForma request={created} details={[]} />
                  </React.Fragment>
                ) : null}
                <InvoiceList
                  documentTitle={documentTitle}
                  requestItems={requestItems}
                  setRequestItems={setRequestItems}
                />
                <InvoiceFooter />
              </PrintTemplateInvoice>
            </div>
            <InvoiceList
              documentTitle={documentTitle}
              requestItems={requestItems}
              setRequestItems={setRequestItems}
            />
            {requestItems && requestItems.length !== 0 ? (
              <CCol xs={12}>
                <CButton
                  component="input"
                  value="Submit request"
                  onClick={() => {
                    submitRequest()
                    setVisible(false)
                  }}
                />
              </CCol>
            ) : null}
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
})

export default CreateProformaInvoice

// <CCol md={6}>
//                       <CFormLabel htmlFor="VAT">VAT</CFormLabel>
//                       <CFormInput
//                         type="number"
//                         name="VAT"
//                         id="VAT"
//                         placeholder="...% VAT"
//
//                         min={0}
//                         max={100}
//                         step="any"
//                         required
//                         {...register('VAT')}
//                       />
//                     </CCol>
