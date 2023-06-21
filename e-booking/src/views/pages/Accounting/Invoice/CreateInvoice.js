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
import BackButton from 'src/components/Navigating/BackButton'
import InvoiceHeader from '../../Printing/InvoiceHeader'
import { DataGrid } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'

const CreateInvoice = React.forwardRef((props, ref) => {
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
  const [view, setView] = useState(false)

  let [requestItems, setRequestItems] = useState([])
  const [created, setCreated] = useState({})
  const clearPurchaseOrder = () => {
    setRequestItems([])
  }

  const createInvoice = async (data) => {
    await instance
      .post('/invoices/add', data)
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
    data.id = uuidv4()
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
  }

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
          <strong> Create Invoice </strong>
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
                        <CFormInput
                          type="text"
                          name="itemName"
                          id="itemName"
                          placeholder="...item "
                          required
                          {...register('name')}
                        />
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="quantity"> Times </CFormLabel>
                      <CFormInput
                        type="number"
                        min={0}
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
              </CCard>
            ) : (
              <div ref={ref || componentRef}>
                <InvoiceHeader />
                <p className="text-center text-uppercase my-3 fw-bold">
                  Invoice N &#176; {created ? created.invoiceGenerated : null}
                </p>
                <div className="col d-flex flex-row border border-2 border-dark">
                  <div className="col p-2 my-0">
                    <div className="my-0">
                      <p className="my-0">
                        {type}: {clientName}
                      </p>
                      <p className="my-0">Function: {role}</p>
                      <p className="my-0">Number of Pax: </p>
                    </div>

                    <p className="col-4 my-0">
                      <span className="fw-bold">DATE : </span>{' '}
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="my-1 py-1">
                  <div className="d-flex justify-content-around">
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
                </div>
                <InvoiceFooter />
              </div>
            )}
          </div>
        </CCol>
      </CRow>
    </div>
  )
})

export default CreateInvoice
