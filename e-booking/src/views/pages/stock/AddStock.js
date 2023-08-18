import React, { useState, useEffect, useRef } from 'react'
import {
  CButton,
  CCardBody,
  CCol,
  CForm,
  CFormLabel,
  CFormSelect,
  CRow,
} from '@coreui/react'
import { Highlighter, Typeahead } from 'react-bootstrap-typeahead'
import { toast } from 'react-hot-toast'
import ReactToPrint from 'react-to-print'
import ReceiveVaucherPrint from '../Printing/ReceiveVaucherPrint'
import { instance } from 'src/API/AxiosInstance'
import {
  removeObjectsWithEmptyProperties,
  sortingWithDates,
} from 'src/utils/functions'
import { useDispatch } from 'react-redux'
import { selectItem } from 'src/redux/Select/selectionActions'
import BackButton from 'src/components/Navigating/BackButton'
import { useForm } from 'react-hook-form'
import ReturnItemsTable from 'src/components/ReturnItemsTable'
import { initialRowsReturning } from 'src/utils/constants'
import SupplyItemsTable from 'src/components/SupplyItemsTable'
import { v4 as uuidv4 } from 'uuid'

const AddStock = React.forwardRef((props, ref) => {
  let [item2] = useState([])
  const { register, watch } = useForm()
  const itemsFrom = watch('purchased')
  const dispatch = useDispatch()
  const componentRef = useRef()
  let [purchaseOrders, setPurchaseOrders] = useState([])
  let [order, setOrder] = useState([])
  const [data, setData] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [selectedSupplier, setSelectedSupplier] = useState([])
  let [returnings, setReturnings] = useState([...initialRowsReturning])
  let [supply, setSupply] = useState([...initialRowsReturning])
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
        console.log(err)
      })
  }

  const returnItemsToStore = async () => {
    returnings = removeObjectsWithEmptyProperties(returnings)
    console.log('el', returnings)
    returnings = returnings.map((el) => ({
      ...el,
      quantity: Number(el.quantity),
    }))
    await instance
      .post('/stock/item/returnItems', { data: returnings })
      .then((res) => {
        if (res.data.message) {
          toast.success(res.data.message)
          setReturnings(initialRowsReturning)
        }
        console.log('res', res)
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
  console.log('order', order)
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
          console.log(err.message)
        })
    }
    const getAllSuppliers = async () => {
      await instance
        .get('supply/all-suppliers')
        .then((res) => {
          if (res && res.data && res.data.data) {
            setSuppliers(res.data.data)
          }
        })
        .catch((er) => {
          console.log('err', er)
        })
    }
    getAllSuppliers()
    getPurchaseOrders()
  }, [])

  return (
    <div className="my-0 py-0">
      <CRow className="my-0 py-0">
        <div className="d-flex justify-content-between my-0 py-0">
          <BackButton />
          <div className="d-flex gap-2">
            {itemsFrom === 'returned' || itemsFrom === 'supplier' ? (
              <p
                className="text-black"
                type="button"
                onClick={() => {
                  if (itemsFrom === 'returned') {
                    setReturnings([
                      ...returnings,
                      {
                        id: uuidv4(),
                        item_id: '',
                        quantity: 0,
                        storeId: '',
                        price: 0,
                      },
                    ])
                  } else {
                    setSupply([
                      ...supply,
                      {
                        id: uuidv4(),
                        item_id: '',
                        quantity: 0,
                        storeId: '',
                        price: 0,
                      },
                    ])
                  }
                }}
              >
                Add row
              </p>
            ) : null}
            {itemsFrom === 'returned' ? (
              <CButton
                component="input"
                value="Return to Stock"
                style={{ backgroundColor: '#000', color: 'white' }}
                onClick={() => {
                  return returnItemsToStore()
                }}
              />
            ) : null}

            {itemsFrom === 'purchased' && order && order.length !== 0 ? (
              order[0].added === 'added' ? (
                <p className="text-uppercase fw-bold text-danger">Added </p>
              ) : (
                <CButton
                  component="input"
                  value="Submit voucher"
                  onClick={() => {
                    return onAddItemToStock(receivedItems)
                  }}
                />
              )
            ) : null}
            {itemsFrom === 'supplier' &&
            selectedSupplier &&
            selectedSupplier.length !== 0 ? (
              <CButton
                component="input"
                value="Submit"
                onClick={async () => {
                  const total = supply
                    .filter((el) => el.quantity !== '')
                    .reduce((a, b) => a + Number(b.quantity * b.price), 0)
                  const supplierId = selectedSupplier[0].id
                  const date = new Date().getTime()
                  const details = supply.filter(
                    (el) => el.quantity !== '' && el.quantity !== 0,
                  )
                  await instance
                    .post('/supply/receive', {
                      details,
                      supplierId,
                      date,
                      total,
                    })
                    .then((res) => {
                      if (res && res.data && res.data.data) {
                        toast.success('cool')
                      }
                    })
                    .catch((err) => {
                      console.log('err', err)
                    })
                }}
              />
            ) : null}

            <ReactToPrint
              trigger={() => (
                <button className="btn btn-ghost-primary">Print</button>
              )}
              content={() => ref || componentRef.current}
            />
          </div>
        </div>
        <CCol xs={12}>
          <p className="text-center text-uppercase">Receive items in stock</p>

          <CCardBody>
            <CForm name="roomClassAddFrm" encType="multipart/form">
              <CRow className="mb-3">
                <CCol md={6}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <CFormLabel htmlFor="from">From</CFormLabel>
                      <CFormSelect {...register('purchased')}>
                        <option value="purchased">Purchase order</option>
                        <option value="returned">Returned</option>
                        <option value="supplier">Supplier</option>
                      </CFormSelect>
                    </div>
                    {itemsFrom === 'purchased' ? (
                      <div>
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
                      </div>
                    ) : null}

                    {itemsFrom === 'supplier' && suppliers.length !== 0 ? (
                      <div>
                        <CFormLabel htmlFor="name">
                          {' '}
                          Choose supplier{' '}
                        </CFormLabel>

                        <Typeahead
                          id="basic-typeahead-single"
                          filterBy={['name']}
                          labelKey="name"
                          onChange={setSelectedSupplier}
                          options={suppliers}
                          placeholder="supplier name ..."
                          selected={selectedSupplier}
                        />
                        {selectedSupplier && selectedSupplier.length !== 0 ? (
                          <p
                            className="text text-danger"
                            onClick={() => setSelectedSupplier([])}
                          >
                            {' '}
                            Clear{' '}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>

          {itemsFrom === 'purchased' && order && order.length !== 0 ? (
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
              </CCol>
            </CRow>
          ) : null}

          {itemsFrom === 'returned' ? (
            <ReturnItemsTable data={returnings} setData={setReturnings} />
          ) : null}
          {itemsFrom === 'supplier' &&
          selectedSupplier &&
          selectedSupplier.length !== 0 ? (
            <SupplyItemsTable data={supply} setData={setSupply} />
          ) : null}
        </CCol>
      </CRow>
    </div>
  )
})

export default AddStock
