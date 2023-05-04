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
import DeliveryList from './DeliveryList'
import DeliveryFooter from '../../Printing/DeliveryFooter'

const DeliveryNote = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const { register, getValues, watch, reset } = useForm()
  const documentTitle = 'Delivery note'
  const quantity = watch('quantity')
  const name = watch('name')
  const [visible, setVisible] = useState(false)
  const [requestItems, setRequestItems] = useState([])
  const clearPurchaseOrder = () => {
    setRequestItems([])
  }

  const createDeliveryNote = async (data) => {
    await instance
      .post('', data)
      .then(() => {
        toast.success('Bon de commande created')
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }

  const dontAdd =
    !quantity || quantity === '' || !name || name === '' ? true : false
  const onAdd = (data) => {
    data.price = 0
    setRequestItems([...requestItems, data])
    reset({ name: '', quantity: '' })
  }
  const submitRequest = () => {
    const data = { order: requestItems }
    createDeliveryNote(data)
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
                  <strong> Create Delivery note </strong>
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
                          {...register('clientName')}
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
                        {...register('clientType', { required: true })}
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
                          {...register('function')}
                        />
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <div>
                        <CFormLabel htmlFor="fax"> Number of FAX </CFormLabel>
                        <CFormInput
                          type="text"
                          name="fax"
                          id="fax"
                          placeholder="...fax"
                          size="md"
                          required
                          {...register('fax')}
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
                <DeliveryList
                  documentTitle={documentTitle}
                  requestItems={requestItems}
                  setRequestItems={setRequestItems}
                />
                <DeliveryFooter />
              </PrintTemplateInvoice>
            </div>
            <DeliveryList
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

export default DeliveryNote
