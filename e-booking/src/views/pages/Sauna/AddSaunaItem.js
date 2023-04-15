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
import { instance, getTokenPromise } from 'src/API/AxiosInstance'

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

const AddSaunaItem = React.forwardRef((props, ref) => {
  const { register, getValues, reset } = useForm()
  const componentRef = useRef()
  let [purchaseOrders, setPurchaseOrders] = useState([])
  const [visible, setVisible] = useState(false)
  let [item2, setItem2] = useState([])
  const [order, setOrder] = useState([])

  let stockItems =
    order && order.length !== 0
      ? order[0].StockPurchaseOrderDetails.map((e) => {
          return { name: e.StockItem.name, ...e }
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
          item_id: item2[0].StockItem.id,
          stockPurchaseOrderId: item2[0].id,
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
    console.log('data to add to stock', { data: data })

    await instance
      .post('/receive/voucher/add', { data: data })
      .then(toast.success('items added to stock'))
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
          Purchase order of : {new Date(option.date).toLocaleDateString()}
        </small>
      </div>
    </div>
  )

  useEffect(() => {
    const getPurchaseOrders = async () => {
      await instance
        .get('/purchase/order/all')
        .then((res) => {
          console.log('res,res,res', res)
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
                  <strong> Add item to Sauna stock</strong>
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
                      </div>
                      <Typeahead
                        disabled={isDisabled}
                        id="basic-typeahead-single"
                        filterBy={['uuid']}
                        labelKey="uuid"
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
                        id="quantity"
                        placeholder="50  "
                        size="md"
                        required
                        {...register('quantity')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="unit"> Unit </CFormLabel>
                      <CFormSelect
                        name="unit"
                        id="unit"
                        size="md"
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
                        name="price"
                        id="price"
                        placeholder="1000"
                        size="md"
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

export default AddSaunaItem
