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
import { instance, getTokenPromise } from 'src/API/AxiosInstance'
import PurchaseOrderFooter from '../Printing/PurchaseOrderFooter'

const RequestToCashier = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const typeaheadRef = useRef()
  const { register, getValues, reset } = useForm()
  const [stockItems, setStockItems] = useState([])
  const [visible, setVisible] = useState(false)
  let items = stockItems
  const [item, setItem] = useState(null)
  const [requestItems, setRequestItems] = useState([])
  const clearPurchaseOrder = () => {
    setRequestItems([])
  }

  const createPurchaseOrder = async (data) => {
    await instance
      .post('/purchase/order/add', data)
      .then(() => {
        toast.success('purchase order created')
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }

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

    getStockItems()
  }, [])
  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between">
                <h3>
                  <strong> Stock to Cashier request </strong>
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
                        <option value="Kg"> Kg </option>
                        <option value="l"> ltr </option>
                        <option value="piece"> piece </option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="price"> Price / unit </CFormLabel>
                      <CFormInput
                        type="number"
                        name="price"
                        id="price"
                        placeholder="item price in RWF"
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
