import React, { useState, useEffect, useRef } from 'react'
import {
  CButton,
  CCardBody,
  CCol,
  CForm,
  CFormLabel,
  CRow,
} from '@coreui/react'
import { Highlighter, Typeahead } from 'react-bootstrap-typeahead'
import { toast } from 'react-hot-toast'
import ReactToPrint from 'react-to-print'
import ReceiveVaucherPrint from '../Printing/ReceiveVaucherPrint'
import { instance } from 'src/API/AxiosInstance'
import { sortingWithDates } from 'src/utils/functions'
import { useDispatch } from 'react-redux'
import { selectItem } from 'src/redux/Select/selectionActions'
import BackButton from 'src/components/Navigating/BackButton'

const AddStock = React.forwardRef((props, ref) => {
  let [item2] = useState([])
  const dispatch = useDispatch()
  const componentRef = useRef()
  let [purchaseOrders, setPurchaseOrders] = useState([])
  let [order, setOrder] = useState([])
  const [data, setData] = useState([])
  const selectOrder = (newOrder) => {
    dispatch(selectItem(newOrder))
    return setOrder(newOrder)
  }
  let stockItems =
    order && order.length !== 0
      ? order[0].StockPurchaseOrderDetails.map((e) => {
          return { name: e.StockItemNew.name, ...e }
        })
      : order
  const [receivedItems, setReceivedItems] = useState([])

  const clearPurchaseOrderSelect = () => {
    setOrder([])
  }
  let isDisabled = false
  if (order && order.length !== 0) {
    isDisabled = !isDisabled
  }
  const onAddItemToStock = async () => {
    let submitting = data.map((el) => ({
      quantity: el.requestQuantity,
      price: el.unitPrice,
      itemName: el.StockItemNew.name,
      item_id: el.StockItemNew.id,
      stockPurchaseOrderId: order[0].id,
    }))
    await instance
      .post('/receive/voucher/add', { data: submitting })
      .then(toast.success('items added to stock'))
      .catch((err) => {
        toast.error(err.message)
        console.log(err)
      })
  }

  purchaseOrders = sortingWithDates(purchaseOrders)
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
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getPurchaseOrders()
  }, [])

  return (
    <div className="my-0 py-0">
      <CRow className="my-0 py-0">
        <div className="d-flex justify-content-between my-0 py-0">
          <BackButton />
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-ghost-primary">Print</button>
            )}
            content={() => ref || componentRef.current}
          />
        </div>
        <CCol xs={12}>
          <p className="text-center text-uppercase">Receive items in stock</p>
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
                    id="basic-typeahead-single"
                    filterBy={['purchaseOrderId']}
                    labelKey="purchaseOrderId"
                    {...props}
                    onChange={selectOrder}
                    options={purchaseOrders}
                    placeholder="order id ..."
                    selected={order}
                  />
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>

          {order && order.length !== 0 ? (
            <CRow>
              <CCol xs={12}>
                <p className="text-center text-uppercase">
                  <strong> Receive vaucher </strong>
                </p>
                <ReceiveVaucherPrint
                  ref={ref || componentRef}
                  title="Receive Vaucher"
                  purchaseOrderItems={order[0].StockPurchaseOrderDetails}
                  setData={setData}
                />

                <CCol xs={12}>
                  <CButton
                    component="input"
                    value="Submit voucher"
                    onClick={() => {
                      return onAddItemToStock(receivedItems)
                    }}
                  />
                </CCol>
              </CCol>
            </CRow>
          ) : null}
        </CCol>
      </CRow>
    </div>
  )
})

export default AddStock
