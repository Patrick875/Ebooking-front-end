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
import PrintTemplateInvoice from '../../Printing/PrintTemplateInvoice'
import BackButton from 'src/components/Navigating/BackButton'
import DeliveryFooter from '../../Printing/DeliveryFooter'
import ReactDatePicker from 'react-datepicker'
import { DataGrid } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

const DeliveryNote = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const { register, getValues, watch, reset } = useForm()
  const quantity = watch('quantity')
  const times = watch('times')
  const description = watch('description')
  const type = watch('outside.clientType') || ''
  const role = watch('outside.function') || ''
  const clientName = watch('outside.clientName') || ''
  const [hidePrice, setHidePrice] = useState(false)
  let [view, setView] = useState(false)
  const [date, setDate] = useState(new Date())
  let [requestItems, setRequestItems] = useState([])
  const [created, setCreated] = useState({})

  const createDeliveryNote = async (data) => {
    await instance
      .post('/deliveryNote/add', data)
      .then((res) => {
        toast.success('Delivery note created')
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
    !times ||
    times === '' ||
    Number(times) < 0 ||
    !description ||
    description === ''
      ? true
      : false
  const onAdd = (data) => {
    data.id = uuidv4()
    data.date = date
    setRequestItems([...requestItems, data])
    reset({ name: '', quantity: '' })
  }
  const submitRequest = () => {
    let data
    const outsideData =
      requestItems && requestItems.length !== 0 ? requestItems[0].outside : {}
    requestItems = requestItems.map((requestItem) => {
      delete requestItem.outside
      return { ...requestItem }
    })
    data = { ...outsideData, details: requestItems }
    createDeliveryNote({ ...data })
  }

  const orderTotal =
    requestItems && requestItems.length !== 0
      ? requestItems.reduce(
          (a, b) => a + Number(b.quantity * b.times * b.unitPrice),
          0,
        )
      : 0

  const columns = [
    {
      headerName: 'Date',
      field: 'date',
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      sortable: false,
      editable: true,
      type: date,
      valueGetter: (params) => {
        if (params.row.date) {
          return params.row.date.toLocaleDateString()
        } else {
          return ''
        }
      },
      valueSetter: (params) => {
        const updateRow = {
          ...params.row,
          date: params.value,
        }
        let newRows = requestItems.map((item) =>
          item.id === params.row.id
            ? { ...params.row, date: params.value }
            : item,
        )
        setRequestItems([...newRows])
        return updateRow
      },
    },
    {
      headerName: 'Description',
      field: 'description',
      flex: 1,
      minWidth: 200,
      maxWidth: 250,
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
      minWidth: 100,
      maxWidth: 120,
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
      minWidth: 100,
      maxWidth: 120,
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
      field: 'unitPrice',
      headerName: 'P.U',
      flex: 1,
      minWidth: 100,
      maxWidth: 120,
      editable: true,
      sortable: false,
      hide: (params) => params.rowIndex === requestItems.length,
      valueSetter: (params) => {
        const updateRow = {
          ...params.row,
          unitPrice: params.value,
        }
        let newRows = requestItems.map((item) =>
          item.id === params.row.id
            ? { ...params.row, unitPrice: params.value }
            : item,
        )
        setRequestItems([...newRows])
        return updateRow
      },
      valueGetter: (params) => {
        if (params.rowIndex === requestItems.length - 1) {
          return null
        } else {
          if (hidePrice) {
            return 0
          } else {
            return params.row.unitPrice
          }
        }
      },
    },
    {
      field: 'total',
      headerName: 'T.P',
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      sortable: false,
      valueGetter: (params) => {
        if (hidePrice) {
          return 0
        } else {
          return `${
            Number(
              params.row.quantity * params.row.unitPrice * params.row.times,
            ) || params.row.total
          } `
        }
      },
    },
  ]

  const total = {
    id: 1000,
    description: 'Total',
    flex: 1,
    unitPrice: '',
    quantity: '',
    minWidth: 200,
    maxWidth: 300,
    total: orderTotal,
  }

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
                  Add more items
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
                      Submit invoice
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
                          {...register('quantity')}
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
                          required
                          {...register('description')}
                        />
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="times"> Times </CFormLabel>
                      <CFormInput
                        type="number"
                        min={0}
                        defaultValue={1}
                        name="times"
                        id="times"
                        placeholder="... "
                        required
                        {...register('times')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="price"> Price </CFormLabel>
                      <CFormInput
                        type="number"
                        min={0}
                        defaultValue={1}
                        name="price"
                        id="price"
                        placeholder="... "
                        required
                        {...register('unitPrice')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="date"> Date</CFormLabel>
                      <ReactDatePicker
                        className="form-control"
                        timeFormat="p"
                        selected={date}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        popperPlacement="bottom-end"
                        onChange={(date) => setDate(date)}
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
                  <h5 className="text-center my-3 text-uppercase">
                    Delivery note N &#176; {created.deliveryNoteId}
                  </h5>
                ) : null}

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

                    <p className="col-4 my-0">
                      <span className="fw-bold">DATE : </span>{' '}
                      {new Date(date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="col">
                  <DataGrid
                    rows={[...requestItems, total]}
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
                <DeliveryFooter />
              </PrintTemplateInvoice>
            )}
          </div>
        </CCol>
      </CRow>
    </div>
  )
})

export default DeliveryNote
