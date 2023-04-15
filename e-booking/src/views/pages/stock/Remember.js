import { useState, useEffect } from 'react'
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
import { Typeahead } from 'react-bootstrap-typeahead'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const AddStock = () => {
  const { register, handleSubmit, getValues, reset } = useForm()
  let [purchaseOrders, setPurchaseOrders] = useState([])
  const [visible, setVisible] = useState(false)
  let [items, setItems] = useState([])
  const [item, setItem] = useState(null)
  const [order, setOrder] = useState({})

  const [receivedItems, setReceivedItems] = useState([])
  console.log(purchaseOrders)
  purchaseOrders =
    purchaseOrders.length !== 0
      ? purchaseOrders.map((e) => {
          let id = e.id.toString()
          return { ...e, uuid: id }
        })
      : purchaseOrders
  const onAdd = (data) => {
    data = { ...data, name: item[0].name, id: item[0].id }
    setReceivedItems([...receivedItems, data])
    reset()
  }
  useEffect(() => {
    const getPurchaseOrders = async () => {
      const res = await axios
        .get('http://206.81.29.111:80/api/v1/purchase/order/all')
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
                  <strong> Items received in stock </strong>
                </h3>
                <CButton
                  component="input"
                  value="Add items to list "
                  onClick={() => {
                    return setVisible(!visible)
                  }}
                />
              </div>
            </CCardHeader>
            <CCollapse visible={visible}>
              <CCardBody>
                <CForm name="roomClassAddFrm" encType="multipart/form">
                  <CRow className="mb-3">
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
                        id="basic-typeahead-single"
                        filterBy={['uuid']}
                        labelKey="uuid"
                        onChange={setOrder}
                        options={purchaseOrders}
                        placeholder="item name ..."
                        selected={item}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="name"> Item name </CFormLabel>
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
                  <CCardHeader>
                    <h3>
                      <strong> Receive vaucher </strong>
                    </h3>
                  </CCardHeader>
                  <CCardBody>
                    <CTable bordered>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell scope="col">#</CTableHeaderCell>
                          <CTableHeaderCell scope="col">
                            {' '}
                            Item{' '}
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col"> Qty </CTableHeaderCell>
                          <CTableHeaderCell scope="col">
                            {' '}
                            Price/unit{' '}
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col">
                            {' '}
                            Total{' '}
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {receivedItems && receivedItems.length !== 0 ? (
                          receivedItems.map((item, index) => {
                            return (
                              <CTableRow key={index + 1}>
                                <CTableHeaderCell scope="row">
                                  {' '}
                                  {index + 1}{' '}
                                </CTableHeaderCell>
                                <CTableDataCell> {item.name} </CTableDataCell>
                                <CTableDataCell>
                                  {' '}
                                  {item.quantity} {item.unit}{' '}
                                </CTableDataCell>
                                <CTableDataCell> {item.price} </CTableDataCell>
                                <CTableDataCell>
                                  {' '}
                                  {Number(item.price) *
                                    Number(item.quantity)}{' '}
                                </CTableDataCell>
                              </CTableRow>
                            )
                          })
                        ) : (
                          <div className="text-center"> No items added</div>
                        )}
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                  {receivedItems && receivedItems.length !== 0 ? (
                    <CCol xs={12}>
                      <CButton
                        component="input"
                        value="Submit voucher"
                        onClick={() => {
                          console.log(receivedItems)
                          setReceivedItems([])
                          setVisible(!visible)
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
}

export default AddStock

//  <Typeahead
//                         id="basic-typeahead-single"
//                         filterBy={['name']}
//                         labelKey="name"
//                         onChange={setItem}
//                         options={purchaseOrders}
//                         placeholder="item name ..."
//                         selected={item}
//                       />

// <div className="d-flex justify-content-between">
//                         <CFormLabel htmlFor="name"> Item name </CFormLabel>
//                         {items && items.length === 0 ? (
//                           <Link to="/stock/item/add" className="d-block">
//                             Add item to list
//                           </Link>
//                         ) : null}
//                       </div>
//                       <Typeahead
//                         id="basic-typeahead-single"
//                         filterBy={['name']}
//                         labelKey="name"
//                         onChange={setItem}
//                         options={stockItems}
//                         placeholder="item name ..."
//                         selected={item}
//                       />
//                     </CCol>
