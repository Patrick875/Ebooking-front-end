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
import BackButton from 'src/components/Navigating/BackButton'
import InvoiceHeader from '../../Printing/InvoiceHeader'
import { v4 as uuidv4 } from 'uuid'
import numberToWords from 'number-to-words'
import { removeObjectsWithEmptyProperties } from 'src/utils/functions'
import { initialRows } from 'src/utils/constants'
import EditableTableWithDates from 'src/components/EditableTableWithDates'

const CreatePurchaseOrderAcc = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const { register, watch, reset } = useForm()
  const currency = watch('outside.currency') || ''
  const VAT = watch('VAT') || ''
  const clientData = watch('outside')
  const VATconstant = 18
  const [view, setView] = useState(false)
  const [dates, setDates] = useState([])
  const [created, setCreated] = useState({})
  const clearPurchaseOrder = () => {
    setRequestItems([])
  }
  let [requestItems, setRequestItems] = useState([...initialRows])
  const createPurchaseOrder = async (data) => {
    await instance
      .post('/accounting/purchase/order/add', data)
      .then((res) => {
        toast.success('Invoice created')
        setCreated(res.data.data)
      })
      .catch((err) => {
        toast.error(err.message)
      })
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

  const submitRequest = () => {
    let data
    console.log('data', data)
    const outsideData = clientData
    requestItems = requestItems.map((el) => ({ date: new Date(), ...el }))
    requestItems = removeObjectsWithEmptyProperties(requestItems)

    data = {
      ...outsideData,
      details: requestItems,
      total: orderTotal,
      vatTotal: finalTotal,
    }
    createPurchaseOrder(data)
  }

  return (
    <div>
      <div className="d-flex justify-content-between">
        <BackButton />
        <h5>
          <strong> Create Purchase order </strong>
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
                  Client Details
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
                      return clearPurchaseOrder()
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
                    Submit P.O
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
              <CCard>
                <CForm
                  className="p-3 "
                  name="roomClassAddFrm"
                  encType="multipart/form"
                >
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
                        <CFormLabel htmlFor="function"> PAX </CFormLabel>
                        <CFormInput
                          type="text"
                          name="PAX"
                          id="PAX"
                          placeholder="...PAX"
                          required
                          {...register('outside.pax')}
                        />
                      </div>
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
                </CForm>
              </CCard>
            ) : (
              <div>
                <div ref={ref || componentRef} className="accounting">
                  <InvoiceHeader />
                  <p className="text-center text-uppercase my-3 fw-bold">
                    Purchase order N &#176;{' '}
                    {created ? created.POGenerated : null}
                  </p>
                  <div className="col d-flex flex-row border border-2 border-dark">
                    <div className="col p-2 my-0">
                      <div className="my-0">
                        <p className="my-0">
                          {clientData.clientType}: {clientData.clientName}
                        </p>
                        <p className="my-0">Function: {clientData.function}</p>
                        <p className="my-0">Number of Pax: {clientData.pax} </p>
                      </div>

                      <p className="col-4 my-0">
                        <span className="fw-bold">DATE : </span>{' '}
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="my-0 py-1 px-0 mx-0">
                    <div className="d-flex justify-content-around my-0 py-0 mx-0 py-0">
                      <div className="col px-0 mx-0">
                        <EditableTableWithDates
                          data={[...requestItems]}
                          setData={setRequestItems}
                          readOnly={false}
                          setDates={setDates}
                          dates={dates}
                        />
                      </div>
                    </div>
                    <p className="text-capitalize">
                      <span className="fw-bold"> Total in words : </span>
                      {finalTotal
                        ? numberToWords.toWords(finalTotal)
                        : null}{' '}
                      {currency !== 'USD' ? 'Rwandan Francs' : 'US Dollars'}
                    </p>
                  </div>
                  <InvoiceFooter />
                </div>
              </div>
            )}
          </div>
        </CCol>
      </CRow>
    </div>
  )
})

export default CreatePurchaseOrderAcc
