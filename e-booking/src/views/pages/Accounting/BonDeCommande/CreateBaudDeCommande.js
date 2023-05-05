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
import CalendarContainer from 'src/utils/CalendarContainer'
import DatePicker from 'react-datepicker'

const CreateBaudDeCommande = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const { register, getValues, watch, reset } = useForm()
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const documentTitle = 'Bon de commande'
  const quantity = watch('quantity')
  const price = watch('price')
  const description = watch('description')
  const [visible, setVisible] = useState(false)
  let [requestItems, setRequestItems] = useState([])
  const clearPurchaseOrder = () => {
    setRequestItems([])
  }

  const createBaudDeCommande = async (data) => {
    await instance
      .post('/bonDeCommand/add', data)
      .then(() => {
        toast.success('Bon de commande created')
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }

  const dontAdd =
    !quantity ||
    quantity === '' ||
    !description ||
    description === '' ||
    !price ||
    price === ''
      ? true
      : false
  const onAdd = (data) => {
    setRequestItems([...requestItems, data])
    reset({ name: '', quantity: '', price: '' })
  }
  const submitRequest = () => {
    let data = {
      date_from: new Date(startDate.toString()).getTime(),
      date_to: new Date(endDate.toString()).getTime(),
    }
    const outsideData =
      requestItems && requestItems.length !== 0 ? requestItems[0].outside : {}
    requestItems = requestItems.map((requestItem) => {
      delete requestItem.outside
      return { ...requestItem }
    })

    data = { ...outsideData, ...data, details: requestItems }

    createBaudDeCommande(data)
    reset()
    setStartDate(new Date())
    setEndDate(new Date())
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
                  <strong> Create Bon de commande </strong>
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
                        <CFormLabel htmlFor="company"> COMPANY </CFormLabel>
                        <CFormInput
                          type="text"
                          name="company"
                          id="company"
                          placeholder="...company"
                          size="md"
                          required
                          {...register('outside.company')}
                        />
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <div>
                        <CFormLabel htmlFor="guest"> Guest name </CFormLabel>
                        <CFormInput
                          type="text"
                          name="guest"
                          id="guest"
                          placeholder="...guest"
                          size="md"
                          required
                          {...register('outside.guest_name')}
                        />
                      </div>
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
                        <CFormLabel htmlFor="fax"> Number of PAX </CFormLabel>
                        <CFormInput
                          type="text"
                          name="fax"
                          id="fax"
                          placeholder="...fax"
                          size="md"
                          required
                          {...register('outside.fax')}
                        />
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <div>
                        <CFormLabel htmlFor="description">
                          {' '}
                          Description{' '}
                        </CFormLabel>
                        <CFormInput
                          type="text"
                          name="description"
                          id="description"
                          placeholder="...description "
                          size="md"
                          required
                          {...register('description')}
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
                      <CFormLabel htmlFor="times"> times </CFormLabel>
                      <CFormInput
                        type="number"
                        name="times"
                        id="times"
                        placeholder=".. "
                        defaultValue={1}
                        size="md"
                        required
                        {...register('times')}
                      />
                    </CCol>
                    <CCol md={6} className="d-flex justify-content between">
                      <div className="col">
                        <CFormLabel htmlFor="dateIn" className="d-block">
                          DATE IN
                        </CFormLabel>
                        <DatePicker
                          className="form-control"
                          onChange={(date) => setStartDate(date)}
                          selected={startDate}
                          minDate={new Date()}
                          portalId="root-portal"
                          dateFormat="dd/MM/yyyy"
                          popperPlacement="bottom-end"
                          popperContainer={CalendarContainer}
                          placeholderText="Select a date other than today or yesterday"
                        />
                      </div>
                      <div className="col">
                        <CFormLabel htmlFor="dateOut" className="d-block ">
                          DATE OUT
                        </CFormLabel>
                        <DatePicker
                          className="form-control"
                          selected={endDate}
                          minDate={new Date()}
                          dateFormat="dd/MM/yyyy"
                          popperPlacement="bottom-end"
                          onChange={(date) => setEndDate(date)}
                          placeholderText="Select a date other than today or yesterday"
                        />
                      </div>
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

export default CreateBaudDeCommande

// <CCol md={6}>
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
