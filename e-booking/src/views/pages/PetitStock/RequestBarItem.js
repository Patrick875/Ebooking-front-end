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
import { toast } from 'react-hot-toast'
import ReactToPrint from 'react-to-print'
import PrintTemplate1 from '../Printing/PrintTemplate1'
import { instance } from 'src/API/AxiosInstance'
import StockOrder from './StockOrder'
import BackButton from 'src/components/Navigating/BackButton'
import { useSelector } from 'react-redux'
import { units } from 'src/utils/constants'

const RequestBarItem = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const { register, handleSubmit, watch, getValues, reset } = useForm({
    mode: 'onChange',
  })
  let quantity = watch('quantity')

  let [stockItems, setStockItems] = useState([])
  const [visible, setVisible] = useState(false)
  const petitStock = useSelector((state) => state.selection.selectedPetitStock)
  const [item, setItem] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [requestItems, setRequestItems] = useState([])
  const clearPurchaseOrder = () => {
    setRequestItems([])
    setSubmitted(!submitted)
  }
  const maxValue = item && item.length !== 0 ? item[0].quantity : null
  const dontAdd =
    !quantity || quantity === '' || Number(quantity) > maxValue || !item
      ? true
      : false

  const onAdd = (data) => {
    data = {
      ...data,
      name: item[0].name,
      id: item[0].id,
      price: item[0].price,
      itemValueId: item[0].itemValueId,
    }
    setRequestItems([...requestItems, data])
    reset()
  }

  const submitRequest = async () => {
    const data = { data: requestItems }
    console.log('all data requested', data)
    await instance
      .post('/petitstock/order/add', data)
      .then(() => {
        toast.success('request submitted')
        setSubmitted(true)
      })
      .catch((err) => {
        console.log(err.message)
      })
  }
  useEffect(() => {
    const getStockItems = async () => {
      await instance
        .get('/stock/item/balance')
        .then((res) => {
          const items = res.data.data.map((item) => ({
            name: item.StockItemNew.name,
            quantity: item.quantity,
            price: item.price,
            itemValueId: item.id,
          }))
          setStockItems(items)
        })
        .catch((err) => {
          console.log(err.message)
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
                <BackButton />
                <div className="col">
                  <h3 className="text-center">
                    <strong>Request to stock </strong>
                  </h3>
                </div>
                <div className="col-3 d-flex justify-content-end">
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
              </div>
            </CCardHeader>
            <CCollapse visible={visible}>
              <CCardBody>
                <CForm
                  name="requestToStockFrm"
                  encType="multipart/form"
                  onSubmit={handleSubmit(onAdd)}
                >
                  <CRow>
                    <CCol md={6}>
                      <CFormLabel htmlFor="unit"> PetitStock </CFormLabel>
                      <CFormInput
                        name="petit-stock"
                        id="petit-stock"
                        readOnly={petitStock ? true : false}
                        value={petitStock ? petitStock.name : ''}
                        className="mb-3"
                        aria-label="petit-stock"
                        {...register('petitStock', { required: true })}
                      ></CFormInput>
                    </CCol>

                    <CCol md={6}>
                      <div className="d-flex justify-content-between">
                        <CFormLabel htmlFor="name"> Item name </CFormLabel>
                      </div>
                      <Typeahead
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
                      <div className="d-flex justify-content-between">
                        <CFormLabel htmlFor="quantity"> Quantity </CFormLabel>
                        {item && item.length !== 0 ? (
                          <p>Available quantity : {item[0].quantity}</p>
                        ) : null}
                      </div>
                      <CFormInput
                        type="number"
                        name="quantity"
                        id="quantity"
                        min={0}
                        max={maxValue}
                        placeholder="50  "
                        {...register('quantity', {
                          min: 0,
                          max: maxValue,
                        })}
                      />

                      {quantity &&
                      maxValue !== '' &&
                      Number(quantity) > Number(maxValue) ? (
                        <p className="text-danger">
                          Quantity must be less than {maxValue}
                        </p>
                      ) : null}
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
                  </CRow>
                  <CCol xs={12}>
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
              </CCardBody>
            </CCollapse>
            <div style={{ display: 'none' }}>
              <PrintTemplate1 ref={ref || componentRef}>
                <StockOrder
                  requestItems={requestItems}
                  setRequestItems={setRequestItems}
                />
              </PrintTemplate1>
            </div>
            <StockOrder
              requestItems={requestItems}
              setRequestItems={setRequestItems}
            />
            {requestItems && requestItems.length !== 0 ? (
              <CCol xs={12}>
                <CButton
                  component="input"
                  value="Submit request"
                  disabled={submitted}
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

export default RequestBarItem
