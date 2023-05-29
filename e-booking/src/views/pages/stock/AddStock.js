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
import ReceiveVaucherPrint from '../Printing/ReceiveVaucherPrint'
import { instance } from 'src/API/AxiosInstance'

const AddStockToTable = (props) => {
  const [show, setShow] = useState(false)
  const { receivedItems, setReceivedItems } = props
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
                {receivedItems.map((added, index) => {
                  let total = Number(added.price) * Number(added.quantity)
                  return (
                    <CTableRow
                      key={index + 1}
                      onMouseEnter={() => {
                        setShow(true)
                      }}
                      onMouseLeave={() => {
                        setShow(false)
                      }}
                    >
                      <CTableHeaderCell scope="row">
                        {' '}
                        {index + 1}{' '}
                      </CTableHeaderCell>
                      <CTableDataCell> {added.itemName} </CTableDataCell>
                      <CTableDataCell>
                        {' '}
                        {added.quantity} {added.unit}{' '}
                      </CTableDataCell>
                      <CTableDataCell> {added.price} </CTableDataCell>
                      <CTableDataCell>
                        {total.toLocaleString()}

                        {show ? (
                          <div
                            className="btn btn-danger btn-sm ms-2"
                            onClick={() => {
                              setReceivedItems(
                                receivedItems.filter((item) =>
                                  item !== added ? item : null,
                                ),
                              )
                            }}
                          >
                            Delete item
                          </div>
                        ) : null}
                      </CTableDataCell>
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

const AddStock = React.forwardRef((props, ref) => {
  let [item2, setItem2] = useState([])
  const { register, getValues, reset, watch } = useForm()
  const componentRef = useRef()
  let [purchaseOrders, setPurchaseOrders] = useState([])
  const [visible, setVisible] = useState(false)

  const [order, setOrder] = useState([])

  // const selectedItem = watch('item') || ''
  const price = watch('price') || ''
  const quantity = watch('quantity') || ''

  // if (price === '' && quantity === '' && item2 && item2.length !== 0) {
  //   let values = {
  //     price: item2[0].unitPrice,
  //     quantity: item2[0].requestQuantity,
  //   }
  //   setDefaultValues(values)
  // }
  let stockItems =
    order && order.length !== 0
      ? order[0].StockPurchaseOrderDetails.map((e) => {
          return { name: e.StockItemNew.name, ...e }
        })
      : order
  const [receivedItems, setReceivedItems] = useState([])
  const onAdd = (data) => {
    if (item2 && quantity === '' && price === '') {
      console.log('data1', item2[0])
      data = { price: item2[0].unitPrice, quantity: item2[0].requestQuantity }
    }
    item2 = item2
      ? {
          itemName: item2[0].name,
          item_id: item2[0].StockItemNew.id,
          stockPurchaseOrderId: order[0].id,
        }
      : item2
    data = { ...data, ...item2 }
    console.log('data2', data)
    setReceivedItems([...receivedItems, data])
    setItem2([])
    reset()
  }
  const clearPurchaseOrderSelect = () => {
    setOrder([])
  }
  let isDisabled = false
  if (order && order.length !== 0) {
    isDisabled = !isDisabled
  }
  const onAddItemToStock = async (data) => {
    console.log('data3', data)
    await instance
      .post('/receive/voucher/add', { data: data })
      .then(toast.success('items added to stock'))
      .catch((err) => {
        toast.error(err.message)
        console.log(err)
      })
  }

  props = { ...props }
  props.renderMenuItemChildren = (option, { text }) => (
    <div>
      <Highlighter search={text}>{option.purchaseOrderId}</Highlighter>,
    </div>
  )

  useEffect(() => {
    const getPurchaseOrders = async () => {
      await instance
        .get('/purchase/order/approved')
        .then((res) => {
          setPurchaseOrders(res.data.data)
          console.log('purchase orders', res.data.data)
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
                      <div className="d-flex justify-content-between">
                        <CFormLabel htmlFor="name"> Stock order id </CFormLabel>
                        {item2 && item2.length !== 0 ? (
                          <p
                            className="text text-danger"
                            onClick={() => clearPurchaseOrderSelect()}
                          >
                            {' '}
                            Clear{' '}
                          </p>
                        ) : null}
                      </div>

                      <Typeahead
                        disabled={isDisabled}
                        id="basic-typeahead-single"
                        filterBy={['purchaseOrderId']}
                        labelKey="purchaseOrderId"
                        {...props}
                        onChange={setOrder}
                        options={purchaseOrders}
                        placeholder="order id ..."
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
                        name="quantity"
                        min={0}
                        id="quantity"
                        placeholder="quantity  "
                        defaultValue={
                          item2 && item2[0] ? item2[0].requestQuantity : ''
                        }
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
                        <option value="Kg"> Kg </option>
                        <option value="l"> ltr </option>
                        <option value="piece"> piece </option>
                        <option value="bottle"> bottle </option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="price"> Price / unit </CFormLabel>
                      <CFormInput
                        type="number"
                        name="price"
                        id="price"
                        placeholder="....price"
                        min={0}
                        defaultValue={
                          item2 && item2[0] ? item2[0].unitPrice : ''
                        }
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
                      <AddStockToTable
                        receivedItems={receivedItems}
                        setReceivedItems={setReceivedItems}
                      />
                    </ReceiveVaucherPrint>
                  </div>

                  <CCardHeader>
                    <h3>
                      <strong> Receive vaucher </strong>
                    </h3>
                  </CCardHeader>
                  <AddStockToTable
                    receivedItems={receivedItems}
                    setReceivedItems={setReceivedItems}
                  />

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

export default AddStock
// {
//     defaultValues: {
//       quantity: item2 && item2.length !== 0 ? item2[0].requestQuantity : 0,
//       price: item2 && item2.length !== 0 ? item2[0].unitPrice : 0,
//     },
//   }
