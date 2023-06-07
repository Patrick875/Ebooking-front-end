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
import InvoiceFooter from '../../Printing/InvoiceFooter'
import PrintTemplateInvoice from '../../Printing/PrintTemplateInvoice'
import BackButton from 'src/components/Navigating/BackButton'
import { useSelector } from 'react-redux'
import InvoiceList from '../Invoice/InvoiceList'
import { Typeahead } from 'react-bootstrap-typeahead'

const DeliveryToInvoiceTransfer = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const deliveryNote = useSelector((state) => state.selection.selected)
  const [item, setItem] = useState([])
  const [items, setItems] = useState([...deliveryNote.DeliveryNoteDetails])
  const { register, getValues, watch, reset } = useForm()
  const quantity = watch('quantity')
  const price = watch('price')
  const [visible, setVisible] = useState(false)
  let [requestItems, setRequestItems] = useState([])
  const documentTitle = 'Invoice'
  const clearPurchaseOrder = () => {
    setRequestItems([])
  }

  const createInvoice = async (data) => {
    data.deliveryLink = deliveryNote.id
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
    !quantity || quantity === '' || !price || price === '' ? true : false
  const onAdd = (data) => {
    data.name = item[0].description
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
                  <strong> Transfer to Invoice </strong>
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
                          defaultValue={deliveryNote.clientName}
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
                        <option
                          value="COMPANY"
                          selected={deliveryNote === 'COMPANY'}
                        >
                          COMPANY
                        </option>
                        <option
                          value="INDIVIDUAL"
                          selected={deliveryNote === 'INDIVIDUAL'}
                        >
                          INDIVIDUAL
                        </option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <div>
                        <CFormLabel htmlFor="function"> Function </CFormLabel>
                        <CFormInput
                          type="text"
                          name="function"
                          id="function"
                          defaultValue={deliveryNote.function}
                          placeholder="..."
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
                          defaultValue={
                            item && item.length !== 0 ? item[0].times : null
                          }
                          name="pax"
                          id="pax"
                          placeholder="...pax"
                          defaultvalue={1}
                          required
                          {...register('times')}
                        />
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <div>
                        <CFormLabel htmlFor="itemName"> Item name </CFormLabel>
                        <Typeahead
                          id="basic-typeahead-single"
                          labelKey="description"
                          filterBy={['description']}
                          onChange={setItem}
                          options={items}
                          placeholder="item  ..."
                          selected={item}
                          {...props}
                        />
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="quantity"> Times </CFormLabel>
                      <CFormInput
                        type="number"
                        min={0}
                        defaultValue={
                          item && item.length !== 0 ? item[0].quantity : null
                        }
                        name="quantity"
                        id="quantity"
                        placeholder="50  "
                        required
                        {...register('quantity')}
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
                        required
                        {...register('price')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="unit"> VAT </CFormLabel>
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
                  value="Create invoice"
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

export default DeliveryToInvoiceTransfer
