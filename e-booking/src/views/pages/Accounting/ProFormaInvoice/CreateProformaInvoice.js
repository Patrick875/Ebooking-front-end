import React, { useState, useRef, useEffect } from 'react'
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
import { Highlighter, Typeahead } from 'react-bootstrap-typeahead'
import ClientDetails from '../../Printing/ClientDetails'
import DatePicker from 'react-datepicker'

const CreateProformaInvoice = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const documentTitle = 'Pro forma invoice'
  const { register, getValues, watch, reset } = useForm()
  const quantity = watch('quantity')
  const times = watch('times')
  const [visible, setVisible] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  let [requestItems, setRequestItems] = useState([])
  let [products, setProducts] = useState([])
  let [services, setServices] = useState([])
  let [service, setService] = useState([])
  let request = {}
  const clearPurchaseOrder = () => {
    setRequestItems([])
  }

  const createInvoice = async (data) => {
    await instance
      .post('/proforma/add', data)
      .then(() => {
        toast.success('Pro forma Invoice created')
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
    !service ||
    service.length === 0
      ? true
      : false

  const onAdd = (data) => {
    data.name = service[0].name
    data.price = service[0].price
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
  let allProductsAndServices = [...presentationProducts, ...services]
  if (requestItems.length !== 0) {
    request = { ...request, createdAt: new Date() }
  }
  props = { ...props }
  props.renderMenuItemChildren = (option, { text }) => (
    <div>
      <Highlighter search={text}>
        {option.name + ' : ' + option.price}
      </Highlighter>
    </div>
  )

  useEffect(() => {
    const getAllProducts = async () => {
      await instance
        .get('/products/all')
        .then((res) => {
          if (res.status === 200) {
            setProducts(res.data.data)
          }
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
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

    getAllServices()
    getAllProducts()
  }, [])

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
                  <CButton
                    className="btn-danger"
                    component="input"
                    value="Clear table"
                    onClick={() => {
                      return clearPurchaseOrder()
                    }}
                  />
                ) : null}
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
                        <CFormLabel htmlFor="itemName"> Item name </CFormLabel>
                        <Typeahead
                          id="basic-typeahead-single"
                          labelKey="name"
                          filterBy={['name']}
                          onChange={setService}
                          options={allProductsAndServices}
                          placeholder="item  ..."
                          selected={service}
                          {...props}
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
                        value={
                          service && service.length !== 0 ? service[0].price : 0
                        }
                        required
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
                        <option value="inclusive">Inclusive</option>
                        <option value="exclusive" selected>
                          Exclusive
                        </option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="date of arrival">
                        {' '}
                        Expected date of Arrival{' '}
                      </CFormLabel>
                      <DatePicker
                        className="form-control"
                        selected={new Date()}
                        timeFormat="p"
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
                        selected={new Date()}
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
              <PrintTemplateInvoice
                ref={ref || componentRef}
                documentTitle={documentTitle}
              >
                <ClientDetails details={requestItems} />
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
