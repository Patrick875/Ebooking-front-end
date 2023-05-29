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
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import ReactToPrint from 'react-to-print'
import ReceiveVaucherPrint from '../Printing/ReceiveVaucherPrint'
import { instance } from 'src/API/AxiosInstance'
import { units } from 'src/utils/constants'

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
                    (acc, b) => acc + Number(b.price) * Number(b.quantity), 0, )
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

const AddBarItem = React.forwardRef((props, ref) => {
  const { register, getValues, reset } = useForm()
  const componentRef = useRef()
  let [purchaseOrders, setPurchaseOrders] = useState([])
  let [petitStock, setPetitStock] = useState([])
  const [visible, setVisible] = useState(false)
  let items = []
  let [item2, setItem2] = useState([])
  const [order, setOrder] = useState([])

  let stockItems =
    order && order.length !== 0
      ? order[0].StockPurchaseOrderDetails.map((e) => {
          return { name: e.StockItemNew.name, ...e }
        })
      : order
  const [receivedItems, setReceivedItems] = useState([])

  purchaseOrders =
    purchaseOrders.length !== 0
      ? purchaseOrders.map((e) => {
          let id = e.id.toString()
          return { ...e, uuid: id }
        })
      : purchaseOrders
  const onAdd = (data) => {
    console.log('item2', item2)
    item2 = item2
      ? {
          itemName: item2[0].name,
          item_id: item2[0].stockItemNewId,
          stockPurchaseOrderId: item2[0].stockPurchaseOrderId,
        }
      : item2
    data = { ...data, ...item2 }
    setReceivedItems([...receivedItems, data])
    reset()
  }

  let isDisabled = false
  if (order && order.length !== 0) {
    isDisabled = !isDisabled
  }
  const onAddItemToStock = async (data) => {
    await instance
      .post('/purchase/order/data', data)
      .then(() => {
        toast.success('items added to stock')
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }

  props = { ...props }
  props.renderMenuItemChildren = (option, { text }) => (
    <div>
      <Highlighter search={text}>{option.uuid}</Highlighter>,
      <div>
        <small>
          Purchase order of : {new Date(option.createdAt).toLocaleDateString()}
        </small>
      </div>
    </div>
  )

  useEffect(() => {
    const getPurchaseOrders = async () => {
      await instance
        .get('/purchase/order/all')
        .then((res) => {
          setPurchaseOrders(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    const getAllPetitStock = async () => {
      await instance.get('/petit-stock/all').then((res) => {
        setPetitStock(res.data.data)
      })
    }
    getAllPetitStock()
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
                  <strong> Items received in stock </strong>
                </h3>
                <CButton
                  component="input"
                  value="Add items to list "
                  onClick={() => {
                    return setVisible(!visible)
                  }}
                />

                {receivedItems && receivedItems.length !== 0 ? (
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
                      <CFormLabel htmlFor="bar"> Bar </CFormLabel>
                      <CFormSelect
                        name="bar"
                        id="unit"
                        className="mb-3"
                        aria-label="bar "
                        {...register('bar', { required: true })}
                      >
                        {petitStock && petitStock.length !== 0
                          ? petitStock.map((ps) => (
                              <option value={ps.name}>{ps.name}</option>
                            ))
                          : null}
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <div className="d-flex justify-content-between">
                        <CFormLabel htmlFor="name">
                          {' '}
                          Purchase order id{' '}
                        </CFormLabel>
                        {items && items.length === 0 ? (
                          <Link
                            to="/booking/stock/item/add"
                            className="d-block"
                          >
                            Add item to list
                          </Link>
                        ) : null}
                      </div>
                      <Typeahead
                        disabled={isDisabled}
                        id="basic-typeahead-single"
                        filterBy={['uuid']}
                        labelKey="uuid"
                        {...props}
                        onChange={setOrder}
                        options={purchaseOrders}
                        placeholder="item name ..."
                        selected={order}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="name"> Item name </CFormLabel>
                      {order && order.length !== 0 ? (
                        <Typeahead
                          id="basic-typeahead-single"
                          filterBy={['name']}
                          labelKey="name"
                          onChange={setItem2}
                          options={stockItems}
                          placeholder="item name ..."
                          selected={item2}
                        />
                      ) : null}
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
                        {units.map((unit) => (
                          <option value={unit.symbol}>{unit.symbol}</option>
                        ))}
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
                    <ReceiveVaucherPrint
                      ref={ref || componentRef}
                      title="Receive Vaucher"
                      receivedItems={receivedItems}
                      purchaseOrderItems={stockItems}
                    >
                      <AddStockToTable receivedItems={receivedItems} />
                    </ReceiveVaucherPrint>
                  </div>

                  <CCardHeader>
                    <h3>
                      <strong> Receive vaucher </strong>
                    </h3>
                  </CCardHeader>
                  <AddStockToTable receivedItems={receivedItems} />

                  {receivedItems && receivedItems.length !== 0 ? (
                    <CCol xs={12}>
                      <CButton
                        component="input"
                        value="Submit voucher"
                        onClick={() => {
                          console.log(receivedItems)
                          setReceivedItems([])
                          setVisible(!visible)
                          setOrder([])
                          return onAddItemToStock(receivedItems)
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

export default AddBarItem
