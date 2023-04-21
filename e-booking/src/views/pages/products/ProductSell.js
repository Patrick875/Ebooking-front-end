import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Typeahead } from 'react-bootstrap-typeahead'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import OrdersTable from '../Bar/OrdersTable'
import { currencies } from 'src/utils/constants'
import PrintHeader from '../Printing/PrintHeader'
import ReactToPrint from 'react-to-print'

function getPrice(elements, PItem, PackId) {
  elements = elements.filter((e) => (e.Packages.length !== 0 ? e : ''))

  let element = elements.filter((element) =>
    element.name === PItem ? element : '',
  )
  let Packages = element[0].Packages

  let pack = Packages.filter((pack) => (pack.id == PackId ? pack : null))

  let packagePrice = pack && pack.length !== 0 ? pack[0].ProductPackage : null
  let price = packagePrice ? packagePrice.price : 0
  return price
}

// function PaymentModal(props) {
//   const { visible, setVisible, register, orderItems } = props
//   console.log(orderItems)

//   return (
//     <CModal
//       size="lg"
//       alignment="center"
//       visible={visible}
//       onClose={() => setVisible(false)}
//       className="d-flex justify-content-center"
//     >
//       <div className=" m-3 ">
//         <p className="lead fs-2 fw-bold">Client payment</p>
//         <CCol>
//           <CFormLabel htmlFor="paymentMethod">Payment</CFormLabel>
//           <CFormInput
//             name="payment"
//             id="payment"
//             type="text"
//             size="md"
//             className="mb-3"
//             {...register('payment')}
//           />
//         </CCol>
//         <CCol className="d-flex gap-2">
//           <div className="col">
//             <CFormLabel htmlFor="paymentMethod">Payment method</CFormLabel>
//             <CFormSelect
//               name="paymentMethod"
//               id="paymentMethod"
//               size="md"
//               className="mb-3"
//               {...register('paymentMethod')}
//             >
//               <option value="Cash">Cash</option>
//               <option value="Mobile Money">Mobile Money</option>
//               <option value="Credit card">Credit card</option>
//               <option value="Credit">Credit</option>
//               <option value="Cheque">Cheque</option>
//             </CFormSelect>
//           </div>
//           <div className="col">
//             <CFormLabel htmlFor="paymentCurrency">Currency</CFormLabel>
//             <CFormSelect
//               name="paymentMethod"
//               id="currency"
//               size="md"
//               className="mb-3"
//               defaultValue={'RWF'}
//               {...register('currency')}
//             >
//               {Object.keys(currencies).map((curr, i) => (
//                 <option value={curr} key={i + 1}>
//                   {curr} :{currencies[curr]}{' '}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>
//         </CCol>
//         <CCol xs={12} className="mt-2 d-flex justify-content-center ">
//           <CButton
//             component="input"
//             type="submit"
//             value="Pay"
//             className="px-4"
//           />
//         </CCol>
//       </div>
//     </CModal>
//   )
// }

const ProductSell = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const [products, setProducts] = useState([])
  let loggedInUser = useSelector((state) => state.auth.user.Role.name)
  const { register, handleSubmit, watch, reset, getValues } = useForm()
  const [visible, setVisible] = useState(false)
  // const [paymentModal, setPaymentModal] = useState(false)
  const [singleSelections, setSingleSelections] = useState([])
  const [orderItems, setOrderItems] = useState([])
  const quantity = watch('quantity') || 1
  const pItem = watch('pItem')
  let price = 0
  if (singleSelections.length !== 0 && pItem !== '---' && pItem) {
    price = getPrice(products, singleSelections[0].name, pItem)
  }

  const onProductSell = async () => {
    await instance
      .post('/products/package/sell', { packages: orderItems })
      .then(() => {
        toast.success('Order created')
      })
      .catch(() => {
        toast.error('order creation failed')
      })
  }

  const onAddToOrder = (data) => {
    if (singleSelections && singleSelections.length !== 0) {
      data.productName = singleSelections[0].name
      data.productId = singleSelections[0].id
      data.unitPrice = price
      data.total = Number(price) * Number(quantity)

      let packName = singleSelections[0].Packages.filter(
        (item) => item.id === Number(data.pItem),
      )[0].name

      data['packageId'] = Number(pItem)
      data['packName'] = packName

      setOrderItems([...orderItems, data])
    }
  }

  useEffect(() => {
    const getAllProducts = async () => {
      await instance
        .get('/products/all')
        .then((res) => {
          if (res.status === 200) {
            setProducts(res.data.data)
          }
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getAllProducts()
  }, [])
  return (
    <React.Fragment>
      <CRow>
        <CCardHeader>
          {orderItems && orderItems.length !== 0 ? (
            <div className="d-flex gap-2">
              <ReactToPrint
                trigger={() => (
                  <button className="btn btn-ghost-primary">Print</button>
                )}
                content={() => ref || componentRef.current}
              />
              <button
                className="btn btn-ghost-danger"
                onClick={() => {
                  return setOrderItems([])
                }}
              >
                Clear
              </button>
            </div>
          ) : null}
        </CCardHeader>
        <CForm
          className="row"
          name="roomClassAddFrm"
          encType="multipart/form"
          onSubmit={handleSubmit(onProductSell)}
        >
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <div className="d-flex justify-content-between">
                  <h2>Client Order</h2>

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
                <CCardBody className="row">
                  <CCol md={6}>
                    <CFormLabel htmlFor="title"> Table </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="Number"
                      name="title"
                      id="title"
                      size="md"
                      required
                      {...register('table')}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="title"> Client name </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="title"
                      id="title"
                      size="md"
                      {...register('client-name')}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="bar"> Bar </CFormLabel>
                    <CFormSelect
                      name="bar"
                      id="unit"
                      size="md"
                      className="mb-3"
                      aria-label="bar "
                      required
                      {...register('petitStock')}
                    >
                      <option value="kitchen"> Kitchen </option>
                      <option value="main-bar"> Main bar </option>
                      <option value="swimming-pool-bar">
                        {' '}
                        Swimming pool bar{' '}
                      </option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="title"> Product name </CFormLabel>
                    <Typeahead
                      id="basic-typeahead-single"
                      labelKey="name"
                      onChange={setSingleSelections}
                      options={products}
                      placeholder="search product..."
                      selected={singleSelections}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="category">
                      {' '}
                      Product package{' '}
                    </CFormLabel>
                    <CFormSelect
                      name="pack"
                      id="pack"
                      size="md"
                      className="mb-3"
                      aria-label="product package"
                      required
                      {...register('pack')}
                    >
                      <option>---select---</option>
                      {products.length !== 0 && singleSelections.length !== 0
                        ? singleSelections.map((pack) =>
                            pack.Packages && pack.Packages.length !== 0
                              ? pack.Packages.map((p) => (
                                  <option
                                    value={p.id}
                                    key={p.id}
                                    {...register('pItem')}
                                  >
                                    {p.name}
                                  </option>
                                ))
                              : null,
                          )
                        : null}
                    </CFormSelect>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="title"> quantity </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="Number"
                      name="quantity"
                      id="title"
                      size="md"
                      required
                      {...register('quantity')}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel className="d-flex align-content-end flex-col">
                      Total :{' '}
                      <strong className="px-2">
                        {Number(quantity) * Number(price)}
                      </strong>
                    </CFormLabel>
                  </CCol>

                  <CCol
                    xs={12}
                    className={`${
                      loggedInUser === 'controller' ? 'disabled' : ''
                    } text-center my-3`}
                  >
                    <CButton
                      component="input"
                      disabled={
                        singleSelections && singleSelections.length !== 0
                          ? false
                          : true
                      }
                      onClick={() => {
                        const data = getValues()
                        return onAddToOrder(data)
                      }}
                      value="Add item to order"
                    />
                  </CCol>
                </CCardBody>
              </CCollapse>
            </CCard>
          </CCol>

          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <h2 className="text-center">
                  <strong> Checkout</strong>
                </h2>
              </CCardHeader>
              <CCardBody>
                <div style={{ display: 'none' }}>
                  <div
                    className="m-3 p-0 client-receipt"
                    ref={ref || componentRef}
                  >
                    <div style={{ width: '100%', height: '100%' }}>
                      <PrintHeader />
                      <p className="fs-4 fw-bolder text-center my-1">
                        {' '}
                        Receipt{' '}
                      </p>
                      <OrdersTable
                        orderItems={orderItems}
                        setOrderItems={setOrderItems}
                      />
                    </div>
                  </div>
                </div>

                <OrdersTable
                  orderItems={orderItems}
                  setOrderItems={setOrderItems}
                />
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs={12} className="mt-2">
            <CButton component="input" type="submit" value="Payment" />
          </CCol>
        </CForm>
      </CRow>
    </React.Fragment>
  )
})

export default ProductSell
