import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import {
  CButton,
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
import { DataGrid } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'
import numberToWords from 'number-to-words'

const CreateProformaInvoice = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const { register, getValues, watch, reset } = useForm()
  const quantity = watch('quantity')
  const price = watch('price')
  const name = watch('name')
  const type = watch('outside.clientType') || ''
  const role = watch('outside.function') || ''
  const clientName = watch('outside.clientName') || ''
  const VAT = watch('VAT') || ''
  const VATconstant = 18
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  let [requestItems, setRequestItems] = useState([])
  let [view, setView] = useState(false)
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
    Number(price) < 0 ||
    !name ||
    name === '' ||
    !quantity ||
    quantity === '' ||
    Number(quantity) < 0

  const onAdd = (data) => {
    data.id = uuidv4()
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
  const columns = [
    {
      headerName: 'Description',
      field: 'name',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      sortable: false,
      editable: true,
      valueSetter: (params) => {
        const updateRow = {
          ...params.row,
          name: params.value,
        }
        let newRows = requestItems.map((item) =>
          item.id === params.row.id
            ? { ...params.row, name: params.value }
            : item,
        )
        setRequestItems([...newRows])
        return updateRow
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      sortable: false,
      editable: true,
      hide: (params) => params.rowIndex === requestItems.length,
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      valueSetter: (params) => {
        const updateRow = {
          ...params.row,
          quantity: params.value,
        }
        let newRows = requestItems.map((item) =>
          item.id === params.row.id
            ? { ...params.row, quantity: params.value }
            : item,
        )
        setRequestItems([...newRows])
        return updateRow
      },
    },
    {
      field: 'times',
      headerName: 'times',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      editable: true,
      sortable: false,
      valueSetter: (params) => {
        const updateRow = {
          ...params.row,
          times: params.value,
        }
        let newRows = requestItems.map((item) =>
          item.id === params.row.id
            ? { ...params.row, times: params.value }
            : item,
        )
        setRequestItems([...newRows])
        return updateRow
      },
    },
    {
      field: 'price',
      headerName: 'P.U',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      editable: true,
      sortable: false,
      valueSetter: (params) => {
        const updateRow = {
          ...params.row,
          price: params.value,
        }
        let newRows = requestItems.map((item) =>
          item.id === params.row.id
            ? { ...params.row, price: params.value }
            : item,
        )
        setRequestItems([...newRows])
        return updateRow
      },
    },
    {
      field: 'total',
      headerName: 'T.P',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      sortable: false,
      valueGetter: (params) =>
        `${
          Number(params.row.quantity * params.row.price * params.row.times) ||
          params.row.total
        } `,
    },
  ]

  const valueRow = {
    id: 3000,
    name: 'VALUE',
    flex: 1,
    minWidth: 200,
    maxWidth: 300,
    requestQuantity: '',
    unitPrice: '',
    total: orderTotal,
  }
  const vatRow = {
    id: 2000,
    name: 'VAT',
    flex: 1,
    minWidth: 200,
    maxWidth: 300,
    requestQuantity: '',
    unitPrice: '',
    total: amountVAT,
  }
  const totalRow = {
    id: 1000,
    name: 'Total',
    flex: 1,
    minWidth: 200,
    maxWidth: 300,
    requestQuantity: '',
    unitPrice: '',
    total: finalTotal,
  }

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
                  Add more items
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
                            {type} : {clientName}
                          </p>

                          <p className="my-0">Function:{role} </p>
                          <p className="my-0">
                            Number of Pax:
                            {requestItems
                              ? requestItems.map((el, i) => ` ${el.quantity}`)
                              : null}{' '}
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
                      <DataGrid
                        rows={[...requestItems, valueRow, vatRow, totalRow]}
                        columns={columns}
                        hideFooter={true}
                        sx={{
                          '& .MuiDataGrid-cell': {
                            border: '2px solid black ',
                          },
                          '& .MuiDataGrid-columnHeader': {
                            border: '2px solid black ',
                          },
                        }}
                        getColumnProps={(params) => ({
                          style: {
                            display: params.row.id === 1000 ? 'none' : 'flex',
                          },
                        })}
                      />
                    </div>
                  </div>

                  <p className="text-capitalize">
                    {finalTotal ? numberToWords.toWords(finalTotal) : null}{' '}
                    Rwandan Francs
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
