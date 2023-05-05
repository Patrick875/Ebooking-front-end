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
import InvoiceList from './InvoiceList'
import InvoiceFooter from '../../Printing/InvoiceFooter'
import PrintTemplateInvoice from '../../Printing/PrintTemplateInvoice'
import BackButton from 'src/components/Navigating/BackButton'

const CreateInvoice = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const { register, getValues, watch, reset } = useForm()
  const quantity = watch('quantity')
  const price = watch('price')
  const name = watch('name')
  const [visible, setVisible] = useState(false)
  let [requestItems, setRequestItems] = useState([])
  const documentTitle = 'Invoice'
  const clearPurchaseOrder = () => {
    setRequestItems([])
  }

  const createInvoice = async (data) => {
    await instance
      .post('/invoices/add', data)
      .then(() => {
        toast.success('Invoice created')
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }

  const dontAdd =
    !quantity ||
    quantity === '' ||
    !name ||
    name === '' ||
    !price ||
    price === ''
      ? true
      : false
  const onAdd = (data) => {
    setRequestItems([...requestItems, data])
    reset({ name: '', quantity: '', price: '' })
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
    data = { ...outsideData, details: requestItems }
    createInvoice(data)
    reset()
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
                  <strong> Create Invoice </strong>
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
                          size="md"
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
                        size="md"
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
                          size="md"
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
                          name="pax"
                          id="pax"
                          placeholder="...pax"
                          defaultvalue={1}
                          size="md"
                          required
                          {...register('times')}
                        />
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <div>
                        <CFormLabel htmlFor="itemName"> Item name </CFormLabel>
                        <CFormInput
                          type="text"
                          name="itemName"
                          id="itemName"
                          placeholder="...item "
                          size="md"
                          required
                          {...register('name')}
                        />
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="quantity"> Quantity </CFormLabel>
                      <CFormInput
                        type="number"
                        name="quantity"
                        id="quantity"
                        placeholder="50  "
                        size="md"
                        required
                        {...register('quantity')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="price"> Price / unit </CFormLabel>
                      <CFormInput
                        type="number"
                        name="price"
                        id="price"
                        placeholder="item price in RWF"
                        size="md"
                        required
                        {...register('price')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="unit"> VAT </CFormLabel>
                      <CFormSelect
                        name="VAT"
                        id="VAT"
                        size="md"
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
                <InvoiceList
                  requestItems={requestItems}
                  setRequestItems={setRequestItems}
                />
                <InvoiceFooter />
              </PrintTemplateInvoice>
            </div>
            <InvoiceList
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

export default CreateInvoice
//  <CCol md={6}>
//                       <CFormLabel htmlFor="VAT">VAT</CFormLabel>
//                       <CFormInput
//                         type="number"
//                         name="VAT"
//                         id="VAT"
//                         placeholder="...% VAT"
//                         size="md"
//                         min={0}
//                         max={100}
//                         step="any"
//                         required
//                         {...register('VAT')}
//                       />
//                     </CCol>
