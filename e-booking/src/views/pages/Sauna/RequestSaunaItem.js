import React, { useState, useEffect, useRef } from 'react'
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
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCollapse,
} from '@coreui/react'
import { Highlighter, Typeahead } from 'react-bootstrap-typeahead'
import { toast } from 'react-hot-toast'
import ReactToPrint from 'react-to-print'
import { instance, getTokenPromise } from 'src/API/AxiosInstance'
import StockOrder from './StockOrder'
import StockOrderPrint from '../Printing/StockOrderPrint'

const AddStockToTable = (props) => {
  const { receivedItems } = props
  return (
    <div>
      <CCardBody>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col"> Item </CTableHeaderCell>
              <CTableHeaderCell scope="col"> Qty </CTableHeaderCell>
              <CTableHeaderCell scope="col"> Price/unit </CTableHeaderCell>
              <CTableHeaderCell scope="col"> Total </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {receivedItems && receivedItems.length !== 0 ? (
              <React.Fragment>
                {receivedItems.map((item, index) => {
                  let total = Number(item.price) * Number(item.quantity)
                  return (
                    <CTableRow key={index + 1}>
                      <CTableHeaderCell scope="row">
                        {' '}
                        {index + 1}{' '}
                      </CTableHeaderCell>
                      <CTableDataCell> {item.itemName} </CTableDataCell>
                      <CTableDataCell>
                        {' '}
                        {item.quantity} {item.unit}{' '}
                      </CTableDataCell>
                      <CTableDataCell> {item.price} </CTableDataCell>
                      <CTableDataCell>{total.toLocaleString()}</CTableDataCell>
                    </CTableRow>
                  )
                })}
                <CTableRow key={receivedItems.length}>
                  <CTableHeaderCell scope="row"></CTableHeaderCell>
                  <CTableHeaderCell> Total </CTableHeaderCell>
                  <CTableDataCell />
                  <CTableDataCell />
                  <CTableDataCell>
                    {receivedItems
                      .reduce(
                        (acc, b) => acc + Number(b.price) * Number(b.quantity),
                        0,
                      )
                      .toLocaleString()}
                  </CTableDataCell>
                </CTableRow>
              </React.Fragment>
            ) : (
              <div className="text-center"> No items added</div>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </div>
  )
}

const RequestSaunaItem = React.forwardRef((props, ref) => {
  const { register, getValues, reset } = useForm()
  const componentRef = useRef()
  let [purchaseOrders, setPurchaseOrders] = useState([])
  const [visible, setVisible] = useState(false)

  const [order, setOrder] = useState([])

  let stockItems =
    order && order.length !== 0
      ? order[0].StockPurchaseOrderDetails.map((e) => {
          return { name: e.StockItemNew.name, ...e }
        })
      : order

  const [requestItems, setRequestItems] = useState([])
  purchaseOrders =
    purchaseOrders.length !== 0
      ? purchaseOrders.map((e) => {
          let id = e.id.toString()
          return { ...e, uuid: id }
        })
      : purchaseOrders
  const onAdd = (data) => {
    setRequestItems([...requestItems, data])
    reset()
  }

  let isDisabled = false
  if (order && order.length !== 0) {
    isDisabled = !isDisabled
  }
  const onAddItemToStock = async (data) => {
    await instance
      .post('/purchase/order/data', data)
      .then(toast.success('items added to stock'))
      .catch((err) => {
        toast.error(err.message)
      })
  }

  useEffect(() => {
    const getPurchaseOrders = async () => {
      await instance
        .get('/purchase/order/all')
        .then((res) => {
          console.log(res)
          setPurchaseOrders(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getPurchaseOrders()
  }, [])
  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between">
                <h3>
                  <strong> Request item in stock </strong>
                </h3>

                <CButton
                  component="input"
                  value="Add items to list "
                  onClick={() => {
                    return setVisible(!visible)
                  }}
                />

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
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel htmlFor="name"> Item name </CFormLabel>
                      <CFormInput
                        type="text"
                        name="name"
                        id="name"
                        placeholder="...name"
                        required
                        {...register('name')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="quantity"> Quantity </CFormLabel>
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
                      <CFormLabel htmlFor="unit"> Unit </CFormLabel>
                      <CFormSelect
                        name="unit"
                        id="unit"
                        className="mb-3"
                        aria-label="item quantity unit"
                        {...register('unit', { required: true })}
                      >
                        <option value="piece"> piece </option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="price"> Price / unit </CFormLabel>
                      <CFormInput
                        type="number"
                        min={0}
                        name="price"
                        id="price"
                        placeholder="1000"
                        required
                        {...register('price')}
                      />
                    </CCol>
                  </CRow>

                  <CCol xs={12}>
                    <CButton
                      component="input"
                      value="Add item"
                      onClick={() => {
                        const data = getValues()
                        return onAdd(data)
                      }}
                    />
                  </CCol>
                </CForm>
              </CCardBody>
            </CCollapse>
            <CRow>
              <CCol xs={12}>
                <CCard className="mb-4">
                  <div style={{ display: 'none' }}>
                    <StockOrderPrint
                      ref={ref || componentRef}
                      title="SAUNA AND MASSAGE "
                    >
                      <StockOrder
                        requestItems={requestItems}
                        setRequestItems={setRequestItems}
                      />
                    </StockOrderPrint>
                  </div>
                  <StockOrder
                    requestItems={requestItems}
                    setRequestItems={setRequestItems}
                  />

                  {requestItems && requestItems.length !== 0 ? (
                    <CCol xs={12}>
                      <CButton
                        component="input"
                        value="Submit voucher"
                        onClick={() => {
                          console.log(requestItems)
                          setRequestItems([])
                          setVisible(!visible)
                          setOrder([])
                          return onAddItemToStock(requestItems)
                        }}
                      />
                    </CCol>
                  ) : null}
                </CCard>
              </CCol>
            </CRow>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
})

export default RequestSaunaItem
