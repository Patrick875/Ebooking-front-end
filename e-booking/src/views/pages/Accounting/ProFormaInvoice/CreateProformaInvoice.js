import React, { useState, useRef } from 'react'
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
import ReactToPrint from 'react-to-print'
import { instance } from 'src/API/AxiosInstance'
import InvoiceFooter from '../../Printing/InvoiceFooter'
import PrintTemplateInvoice from '../../Printing/PrintTemplateInvoice'
import BackButton from 'src/components/Navigating/BackButton'
import DatePicker from 'react-datepicker'
import { v4 as uuidv4 } from 'uuid'

import numberToWords from 'number-to-words'
import EditableTable from 'src/components/EditableTable'
import { initialRows } from 'src/utils/constants'
import { removeObjectsWithEmptyProperties } from 'src/utils/functions'

const CreateProformaInvoice = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const { register, getValues, watch, reset } = useForm()

  const role = watch('outside.function') || ''
  const currency = watch('outside.currency') || ''
  const clientData = watch('outside')
  const VAT = clientData ? clientData.VAT : 'inclusive'
  const VATconstant = 18
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  let [requestItems, setRequestItems] = useState([...initialRows])
  let [view, setView] = useState(false)
  const [date, setDate] = useState(new Date())
  const [created, setCreated] = useState({})
  let request = {}

  const createInvoice = async (data) => {
    console.log('submission', data)
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

  const submitRequest = () => {
    let data
    const outsideData = clientData
    requestItems = removeObjectsWithEmptyProperties(requestItems)
    requestItems = requestItems.map((el) => ({ date: new Date(), ...el }))
    data = {
      ...outsideData,
      details: requestItems,
      dateIn: new Date(startDate.toString()).getTime(),
      dateOut: new Date(endDate.toString()).getTime(),
      pax: outsideData.pax,
      total: orderTotal,
      vatTotal: finalTotal,
    }
    createInvoice(data)
  }

  if (requestItems.length !== 0) {
    request = { ...request, createdAt: new Date() }
  }

  const orderTotal =
    requestItems && requestItems.length !== 0
      ? requestItems.reduce(
          (a, b) => a + Number(b.quantity * b.times * b.price),
          0,
        )
      : 0
  const amountVAT = Number((orderTotal * VATconstant) / 100)
  const finalTotal =
    requestItems.length !== 0
      ? VAT === 'exclusive'
        ? Number(orderTotal - amountVAT)
        : Number(orderTotal + amountVAT)
      : 0

  return (
    <div>
      <div className="d-flex justify-content-between">
        <BackButton />
        <h5>
          <strong> Create Pro forma invoice </strong>
        </h5>
      </div>
      <CRow>
        <CCol xs={12}>
          <div className="mb-4">
            {view ? (
              <div className="d-flex gap-3">
                <p
                  className="text-primary "
                  onClick={() => {
                    setView(false)
                  }}
                >
                  Client details
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
                    Submit invoice
                  </p>
                ) : null}
              </div>
            ) : null}

            <div>
              <div className="d-flex justify-content-between">
                {!view ? (
                  <h5
                    className="text-primary"
                    onClick={() => {
                      setView(true)
                    }}
                  >
                    View
                  </h5>
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
            </div>

            {!view ? (
              <CCard className="p-3">
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
                          {...register('outside.pax')}
                        />
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="VAT"> VAT </CFormLabel>
                      <CFormSelect
                        name="VAT"
                        id="VAT"
                        className="mb-3"
                        aria-label="VAT"
                        {...register('outside.VAT', { required: true })}
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
                </CForm>
              </CCard>
            ) : (
              <PrintTemplateInvoice ref={ref || componentRef}>
                {created ? (
                  <React.Fragment>
                    <p className="text-center my-3 text-uppercase fw-bold">
                      Pro forma Invoice N &#176;
                      {created ? created.proformaGenerated : null}
                    </p>
                    <div className="col d-flex flex-row border border-2 border-dark">
                      <div className="col p-2 my-0">
                        <div className="my-0">
                          <p className="fw-bolder text-capitalize my-0">
                            {clientData.clientType} : {clientData.clientName}
                          </p>

                          <p className="my-0">Function:{role} </p>
                          <p className="my-0">
                            Number of Pax:
                            {clientData.pax}
                          </p>
                        </div>
                        {request ? (
                          <p className="col-4 my-0">
                            <span className="fw-bold">DATE : </span>{' '}
                            {new Date().toLocaleDateString()}
                          </p>
                        ) : null}
                      </div>
                      <div className="my-0 mx-2">
                        <p className="fw-bold my-0 py-0">
                          Expected Date of Arrival :{}
                          <span className="fw-normal">
                            {new Date(startDate).toLocaleDateString()}
                          </span>
                        </p>
                        <p className="fw-bold my-0 py-0">
                          Expected Date of Departure :{' '}
                          <span className="fw-normal">
                            {new Date(endDate).toLocaleDateString()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                ) : null}
                <div>
                  <div className="d-flex justify-content-around my-0 py-0">
                    <div className="col">
                      <EditableTable
                        data={[...requestItems]}
                        setData={setRequestItems}
                        readOnly={false}
                      />
                    </div>
                  </div>

                  <p className="text-capitalize">
                    <span className="fw-bold"> Total in words : </span>
                    {finalTotal ? numberToWords.toWords(finalTotal) : null}{' '}
                    {currency !== 'USD' ? ' Rwandan Francs ' : ' US Dollars '}
                  </p>
                </div>

                <InvoiceFooter />
              </PrintTemplateInvoice>
            )}
          </div>
        </CCol>
      </CRow>
    </div>
  )
})

export default CreateProformaInvoice
