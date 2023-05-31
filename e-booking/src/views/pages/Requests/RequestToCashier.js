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
  CCollapse,
} from '@coreui/react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import ReactToPrint from 'react-to-print'
import PrintTemplate1 from '../Printing/PrintTemplate1'
import PurchaseOrder from '../stock/PurchaseOrder'
import { instance } from 'src/API/AxiosInstance'
import PurchaseOrderFooter from '../Printing/PurchaseOrderFooter'
import { units } from 'src/utils/constants'
import BackButton from 'src/components/Navigating/BackButton'
import { useSelector } from 'react-redux'

const RequestToCashier = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const typeaheadRef = useRef()
  const { register, getValues, watch, reset } = useForm()
  const quantity = watch('quantity')
  const price = watch('price')
  const [stores, setStores] = useState([])
  let [stockItems, setStockItems] = useState([])
  const [visible, setVisible] = useState(false)
  let items = stockItems
  const [item, setItem] = useState(null)
  const [requestItems, setRequestItems] = useState([])
  const clearPurchaseOrder = () => {
    setRequestItems([])
  }
  const store = useSelector((state) => state.selection.selectedStore)
  const createPurchaseOrder = async (data) => {
    console.log('data', data)
    await instance
      .post('/purchase/order/add', data)
      .then(() => {
        toast.success('purchase order created')
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }

  stockItems =
    store && stockItems.length !== 0
      ? stockItems.filter((item) => item.storeId === store.id)
      : stockItems
  const dontAdd =
    !quantity ||
    quantity === '' ||
    !item ||
    item.length === 0 ||
    !price ||
    price === ''
      ? true
      : false
  const onAdd = (data) => {
    data = { ...data, name: item[0].name, id: item[0].id }
    setRequestItems([...requestItems, data])
    reset()
  }
  const submitRequest = () => {
    const data = { order: requestItems }
    createPurchaseOrder(data)
  }
  const clearTypeahead = () => {
    typeaheadRef.current.clear()
  }
  useEffect(() => {
    const getStockItems = async () => {
      await instance
        .get('/stock/item/all')
        .then((res) => {
          setStockItems(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    const getAllStores = async () => {
      await instance
        .get('/stock/store/all')
        .then((res) => {
          setStores(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }

    getStockItems()
    getAllStores()
  }, [])
  return (
    <div>
      <BackButton />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between">
                <h3>
                  <strong>Create Purchase order </strong>
                </h3>
                <CButton
                  component="input"
                  value="Add items to list "
                  onClick={() => {
                    return setVisible(!visible)
                  }}
                />

                {requestItems && requestItems.length !== 0 ? (
                  <CButton
                    className="btn-danger"
                    component="input"
                    value="Clear table"
                    onClick={() => {
                      return clearPurchaseOrder()
                    }}
                  />
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
            </CCardHeader>
            <CCollapse visible={visible}>
              <CCardBody>
                <CForm name="roomClassAddFrm" encType="multipart/form">
                  <CRow>
                    <CCol md={6}>
                      <CFormLabel htmlFor="store"> Store </CFormLabel>
                      <CFormSelect
                        name="store"
                        id="store"
                        className="mb-3"
                        aria-label="store"
                        {...register('storeId', { required: true })}
                      >
                        {stores && stores.length !== 0
                          ? stores.map((el) => (
                              <option
                                value={el.id}
                                selected={store ? store.id === el.id : false}
                              >
                                {el.name}
                              </option>
                            ))
                          : null}
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <div className="d-flex justify-content-between">
                        <CFormLabel htmlFor="name"> Item name </CFormLabel>
                        {items && items.length === 0 ? (
                          <Link to="/stock/item/add" className="d-block">
                            Add item to list
                          </Link>
                        ) : null}
                      </div>
                      <Typeahead
                        ref={typeaheadRef}
                        id="basic-typeahead-single"
                        filterBy={['name']}
                        labelKey="name"
                        onChange={setItem}
                        options={stockItems}
                        placeholder="item name ..."
                        selected={item}
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
                        step="0.0000001"
                        name="price"
                        id="price"
                        placeholder="item price in RWF"
                        required
                        {...register('price')}
                      />
                    </CCol>
                  </CRow>
                  <CCol xs={12}>
                    <CButton
                      className="my-2"
                      component="input"
                      value="Add item"
                      disabled={dontAdd}
                      onClick={() => {
                        const data = getValues()
                        clearTypeahead()
                        return onAdd(data)
                      }}
                    />
                  </CCol>
                </CForm>
              </CCardBody>
            </CCollapse>
            <div style={{ display: 'none' }}>
              <PrintTemplate1 ref={ref || componentRef}>
                <PurchaseOrder
                  requestItems={requestItems}
                  setRequestItems={setRequestItems}
                />
                <PurchaseOrderFooter />
              </PrintTemplate1>
            </div>
            <PurchaseOrder
              requestItems={requestItems}
              setRequestItems={setRequestItems}
            />
            {requestItems && requestItems.length !== 0 ? (
              <CCol xs={12}>
                <CButton
                  component="input"
                  value="Submit request"
                  onClick={() => {
                    submitRequest()
                    setVisible(false)
                  }}
                />
              </CCol>
            ) : null}
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
})

export default RequestToCashier
