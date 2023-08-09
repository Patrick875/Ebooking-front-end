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
import PrintTemplateInvoice from '../../Printing/PrintTemplateInvoice'
import BackButton from 'src/components/Navigating/BackButton'
import DeliveryFooter from '../../Printing/DeliveryFooter'
import ReactDatePicker from 'react-datepicker'
import EditableTable from 'src/components/EditableTable'
import { initialRowsDelivery } from 'src/utils/constants'
import {
  processObjects,
  removeObjectsWithEmptyProperties,
} from 'src/utils/functions'
import EditableTableWithDates from 'src/components/EditableTableWithDates'

const DeliveryNote = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const { register, watch } = useForm()
  const clientData = watch('outside')
  const [hidePrice, setHidePrice] = useState(false)
  let [view, setView] = useState(false)
  const date = watch('outside.date')
  let [requestItems, setRequestItems] = useState([...initialRowsDelivery])
  const [created, setCreated] = useState({})

  const createDeliveryNote = async (data) => {
    await instance
      .post('/deliveryNote/add', data)
      .then((res) => {
        toast.success('Delivery note created')
        setCreated(res.data.data)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  const submitRequest = () => {
    let data

    const outsideData = clientData
    outsideData.total = orderTotal
    requestItems = processObjects(requestItems)
    requestItems = removeObjectsWithEmptyProperties(requestItems)
    requestItems = requestItems.map((el) => ({ ...el }))
    data = { ...outsideData, details: requestItems }
    console.log('data-delivery', data)
    createDeliveryNote({ ...data })
  }

  const orderTotal =
    requestItems && requestItems.length !== 0
      ? requestItems.reduce(
          (a, b) => a + Number(b.quantity * b.times * b.unitPrice),
          0,
        )
      : 0

  return (
    <div>
      <div className="d-flex justify-content-between">
        <BackButton />
        <h5>
          <strong> Create Delivery note </strong>
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
                {requestItems && requestItems.length !== 0 ? (
                  <div className="d-flex gap-2 ">
                    <p
                      className="text-primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        return setRequestItems([])
                      }}
                    >
                      {' '}
                      Clear table
                    </p>

                    <p
                      className="text-success"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        return setHidePrice(!hidePrice)
                      }}
                    >
                      {hidePrice ? ' Show Price ' : ' Hide price '}
                    </p>

                    <p
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        return submitRequest()
                      }}
                    >
                      Submit
                    </p>
                  </div>
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
                        <CFormLabel htmlFor="quantity">
                          {' '}
                          Number of PAX{' '}
                        </CFormLabel>
                        <CFormInput
                          type="text"
                          name="quantity"
                          id="quantity"
                          placeholder="...pax"
                          defaultValue={1}
                          required
                          {...register('outside.pax')}
                        />
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel htmlFor="date"> Date</CFormLabel>
                      <CFormInput
                        type="text"
                        name="date"
                        id="date"
                        placeholder="...Date"
                        required
                        {...register('outside.date')}
                      />
                    </CCol>
                  </CRow>
                </CForm>
              </CCard>
            ) : (
              <div
                className="my-0 mx-0 px-0 py-0 accounting"
                ref={ref || componentRef}
              >
                <div className="mx-4">
                  <PrintTemplateInvoice>
                    {created ? (
                      <h5 className="text-center my-3 text-uppercase">
                        Delivery note N &#176; {created.deliveryNoteId}
                      </h5>
                    ) : null}

                    <div className="col d-flex flex-row border border-2 border-dark">
                      <div className="col p-2 my-0">
                        <div className="my-0">
                          <p className="fw-bolder text-capitalize my-0">
                            {clientData.clientType} : {clientData.clientName}
                          </p>

                          <p className="my-0">
                            Function:{clientData.function}{' '}
                          </p>
                          <p className="my-0">
                            Number of Pax:
                            {clientData.pax}
                          </p>
                        </div>

                        <p className="col my-0 d-flex justify-content-end ">
                          <span className="fw-bold border border-2 border-dark p-1">
                            DATE :{date ? date : null}{' '}
                          </span>{' '}
                        </p>
                      </div>
                    </div>
                    <div className="col">
                      <EditableTableWithDates
                        data={[...requestItems]}
                        setData={setRequestItems}
                        hidePrice={hidePrice}
                        readOnly={false}
                      />
                    </div>
                    <DeliveryFooter />
                  </PrintTemplateInvoice>
                </div>
              </div>
            )}
          </div>
        </CCol>
      </CRow>
    </div>
  )
})

export default DeliveryNote
