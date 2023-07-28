import {
  CButton,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import './Product.scss'
import { AiOutlineCloseCircle, AiOutlineEnter } from 'react-icons/ai'
import { IoReturnUpBack } from 'react-icons/io5'
import { allowedKeys, numpadItems } from 'src/utils/constants'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import ReactToPrint from 'react-to-print'
import { RiCheckLine } from 'react-icons/ri'
import AllPetitStock from '../PetitStock/AllPetitStock'
import { useSelector } from 'react-redux'
import CustomerBill from '../Printing/CustomerBill'
import PetitStockBaudDeCommande from '../Printing/PetitStockBaudDeCommande'

const ProductSell = React.forwardRef((props, ref) => {
  const { register, setValue, getValues, watch } = useForm()
  let query = watch('query')
  const user = useSelector(
    (state) => state.auth.user.firstName + ' ' + state.auth.user.lastName,
  )
  const componentRef = useRef()
  const componentRef2 = useRef()
  const [selectedInput, setSelectedInput] = useState(1)
  let [results, setResults] = useState(Array(10).fill(''))
  let [products, setProducts] = useState([])
  let [orderItems, setOrderItems] = useState([])
  const [selectedProduct, setSelectedProduct] = useState()
  const [disabled, setDisabled] = useState(true)
  const [orderState, setOrderState] = useState(false)
  const searchItems = (items, query) => {
    if (!query || query === '') {
      return items
    } else {
      return items.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      )
    }
  }
  products = searchItems(products, query)
  const handleInput = (e) => {
    const currentResult = results[selectedInput - 1]
    const newValue = currentResult + e.target.name
    setResults(
      results.map((result, index) =>
        index === selectedInput - 1 ? newValue : result,
      ),
    )
    setValue(`result${selectedInput}`, parseInt(newValue))
  }

  const clearItems = () => {
    if (results.length !== 0) {
      for (let y = 1; y <= results.length; y++) {
        setValue(`result${y}`, '', false)
        setResults(Array(10).fill(''))
        setOrderItems([])
      }
    }
  }

  const backspace = () => {
    const currentResult = results[selectedInput - 1]
    const newValue = currentResult.slice(0, -1)
    setResults(
      results.map((result, index) =>
        index === selectedInput - 1 ? newValue : result,
      ),
    )
    setValue(`result${selectedInput}`, newValue)
  }
  const handleEnter = () => {}

  const total = () => {
    let total = 0
    if (
      orderItems &&
      orderItems.length !== 0 &&
      results &&
      results.length !== 0
    ) {
      for (let i = 0; i < orderItems.length; i++) {
        if (results[i]) {
          total =
            total + Number(orderItems[i].ProductPackage.price * results[i])
        } else {
          total = total + Number(orderItems[i].ProductPackage.price * 0)
        }
      }
    }
    return total
  }
  const orderTotal = total()

  const [tables, setTables] = useState()
  const [table, setTable] = useState()
  const [petitStock, setPetitStock] = useState(false)
  const handleProductClick = (product) => {
    if (product.Packages && product.Packages.length > 0) {
      setSelectedProduct(product)
    } else {
      let theProduct =
        products && products.length !== 0
          ? products.filter((el) =>
              el.id == product.ProductPackage.ProductId ? el : '',
            )[0]
          : ''

      setOrderItems([
        ...orderItems,
        {
          ...product,
          productName: theProduct.name,
          productId: theProduct.id,
          packageId: product.id,
        },
      ])
    }
  }
  const handleBackClick = () => {
    setSelectedProduct(null)
  }
  const handleKeyboardInput = (event) => {
    if (allowedKeys.includes(event.key)) {
      if (event.key === 'Backspace') {
        backspace()
      } else {
        const input = event.key === '.' ? '.' : parseInt(event.key)
        handleInput({ target: { name: input } })
      }
    }
  }
  const createOrder = async () => {
    results = results.filter((el) => el !== '')
    if (
      results.includes(null) ||
      results.length === 0 ||
      results.length < orderItems.length
    ) {
      return console.log(
        'Order aborted !! Please provide quantities for all items!!!',
      )
    }
    orderItems =
      results.length !== 0
        ? orderItems.map((item, i) => {
            return { ...item, quantity: results[i] }
          })
        : orderItems

    const cool = getValues()

    let packages = orderItems.map((order) => {
      let { productId, packageId, quantity } = order
      return {
        productId,
        packageId,
        quantity,
        petitStock,
        paymentMethod: cool.paymentMethod,
      }
    })

    await instance
      .post('/products/package/sell', { packages: packages, table: table })
      .then(() => {
        toast.success('Order created')
        setTable([])
        setOrderState(true)
      })
      .catch(() => {
        console.log('order creation failed')
      })
  }
  useEffect(() => {
    const getTables = async () => {
      await instance
        .get('/tables/all')
        .then((res) => {
          if (res.status === 200) {
            setTables(res.data.data)
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    }

    const getAllProducts = async () => {
      await instance
        .get('/products/all')
        .then((res) => {
          if (res.status === 200) {
            setProducts(res.data.data)
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    }

    getTables()
    getAllProducts()
  }, [])

  return (
    <div className="m-0 p-0">
      {!petitStock ? (
        <AllPetitStock selling={true} setStock={setPetitStock} />
      ) : (
        <CRow className="my-0 py-0">
          {petitStock ? (
            <div className="my-0 py-0">
              <div className="my-0 py-0 d-flex">
                <button
                  className="btn btn-dark my-0"
                  onClick={() => {
                    setPetitStock(false)
                  }}
                >
                  <IoReturnUpBack />
                </button>
                <p className=" ms-4 fs-4 fst-normal text-uppercase my-0 py-0">
                  {petitStock}
                </p>
              </div>
              <div className="d-flex justify-content-center my-1">
                <form className="my-0">
                  <div className="col">
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="itemName"
                      id="itemName"
                      placeholder="search ..."
                      {...register('query')}
                    />
                  </div>
                </form>
              </div>
            </div>
          ) : null}
          <CCardHeader className="d-flex justify-content-between">
            {orderItems && orderItems.length !== 0 ? (
              <div className="d-flex gap-2">
                <ReactToPrint
                  trigger={() => (
                    <button
                      className="btn btn-ghost-primary"
                      disabled={!orderState}
                    >
                      Customer bill
                    </button>
                  )}
                  content={() => ref || componentRef.current}
                />
                <ReactToPrint
                  trigger={() => (
                    <button
                      className="btn btn-ghost-primary"
                      disabled={!orderState}
                    >
                      Baud de commande
                    </button>
                  )}
                  content={() => ref || componentRef2.current}
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
            {table ? (
              <p className="text-center fst-italic m-0">
                {' '}
                Order for table {table}
              </p>
            ) : null}
          </CCardHeader>
          <CRow className="d-flex">
            <CCol
              md={6}
              className={`${
                selectedProduct ? 'product-sell-packages' : 'product-sell'
              } bg-white  `}
            >
              {selectedProduct ? (
                <React.Fragment>
                  <CButton
                    className="btn btn-primary rounded-0 shadow d-block"
                    onClick={handleBackClick}
                  >
                    <IoReturnUpBack />
                  </CButton>
                  <React.Fragment>
                    {
                      <p
                        className={`col fs-6 fw-bold text-capitalize text-center  `}
                      >
                        {selectedProduct.name}
                      </p>
                    }
                    <CCol className="d-flex">
                      {selectedProduct.Packages.map((pack) => (
                        <CButton
                          key={pack.id}
                          disabled={table ? false : true}
                          className="btn btn-light rounded-0 shadow"
                          onClick={() => handleProductClick(pack)}
                        >
                          {pack.name}
                        </CButton>
                      ))}
                    </CCol>
                  </React.Fragment>
                </React.Fragment>
              ) : products && products.length !== 0 ? (
                products.map((product) => {
                  return (
                    <CButton
                      disabled={table ? false : true}
                      className="btn btn-light rounded-0 shadow"
                      onClick={() => handleProductClick(product)}
                    >
                      {product.name}
                    </CButton>
                  )
                })
              ) : (
                <React.Fragment>No products in database</React.Fragment>
              )}
            </CCol>
            <CCol md={6} className="row mx-0 bg-white ">
              <div className="col d-flex  px-0">
                <div className="numpad ">
                  {numpadItems.map((digit) => (
                    <button
                      key={digit}
                      name={digit}
                      onClick={handleInput}
                      className="btn btn-light rounded-1 shadow-sm"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    className="btn btn-light rounded-1 shadow-sm"
                    onClick={() => {
                      setDisabled(false)
                    }}
                  >
                    🖊️ +
                  </button>
                  <div>
                    <CFormSelect
                      {...register('paymentMethod')}
                      className="dropdown"
                    >
                      <option value={'cash'}>Cash</option>
                      <option value={'MoMo'}>MoMo</option>
                      <option value={'POS'}>Card</option>
                    </CFormSelect>
                  </div>

                  <button
                    className="btn btn-light rounded-1 shadow-sm"
                    disabled={!table || table.length === 0}
                    onClick={() => {
                      createOrder()
                    }}
                  >
                    <RiCheckLine className=" text-success ri-lg" />
                  </button>
                </div>
                <div className="col-2 numpad-action">
                  <button
                    className="btn btn-light rounded-1"
                    onClick={clearItems}
                    id="clear"
                  >
                    <AiOutlineCloseCircle className="text-danger" size="sm" />
                  </button>
                  <button
                    className="btn btn-light rounded-1"
                    onClick={backspace}
                    id="backspace"
                  >
                    C
                  </button>
                  <button
                    className="btn btn-light rounded-1"
                    disabled={orderItems.length === 0 ? true : false}
                    id="enter"
                    onClick={handleEnter}
                  >
                    <AiOutlineEnter className="text-success" />
                  </button>
                </div>
              </div>
            </CCol>
          </CRow>
          <CRow>
            <CCol md={7} className="p-0 m-0">
              <div className="col d-flex justify-content-between">
                <p className="fs-5">Total</p>
                <p className="fs-4">{orderTotal.toLocaleString()}</p>
              </div>
              <div style={{ display: 'none' }}>
                <div
                  className="m-3 p-0 client-receipt"
                  ref={ref || componentRef}
                >
                  <CustomerBill
                    user={user}
                    table={table}
                    orderItems={orderItems}
                    results={results}
                    total={orderTotal.toLocaleString()}
                  />
                </div>

                <div
                  className="m-3 p-0 client-receipt"
                  ref={ref || componentRef2}
                >
                  <PetitStockBaudDeCommande
                    petitStock={petitStock}
                    user={user}
                    table={table}
                    orderItems={orderItems}
                    results={results}
                  />
                </div>
              </div>
              <CTable bordered>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col"> Item </CTableHeaderCell>
                    <CTableHeaderCell scope="col"> P.U </CTableHeaderCell>
                    <CTableHeaderCell scope="col"> Qty </CTableHeaderCell>
                    <CTableHeaderCell scope="col"> Amount </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                {orderItems && orderItems.length !== 0 ? (
                  orderItems.map((item, index) => (
                    <CTableRow>
                      <CTableHeaderCell scope="row">
                        {index + 1}
                      </CTableHeaderCell>
                      <CTableDataCell>
                        <CFormInput
                          {...register(`item${index + 1}`)}
                          readOnly={true}
                          defaultValue={
                            item ? item.name + ' of ' + item.productName : ''
                          }
                          className="border-none outline-none"
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        {Number(item.ProductPackage.price).toLocaleString()}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          key={`result${index + 1}`}
                          type="number"
                          min={0}
                          {...register(`item${index + 1}_quantity`)}
                          value={Number(results[index])}
                          onClick={() => {
                            setSelectedInput(index + 1)
                          }}
                          onKeyDown={handleKeyboardInput}
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        {Number(
                          item.ProductPackage.price * results[index],
                        ).toLocaleString()}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>0 items on order</CTableRow>
                )}
              </CTable>
            </CCol>
            <CCol md={5} className="bg-white product-sell-tables">
              <CTable bordered={true} striped={true} small hover={!disabled}>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col"> Number </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tables && tables.length !== 0 ? (
                    tables
                      .filter((table) => table.status === 'ACTIVE')
                      .map((item, index) => (
                        <CTableRow
                          key={index * 10000}
                          onClick={() => {
                            setTable(item.name)
                            toast.success(
                              `${item.name.toLowerCase()} selected`,
                              {
                                duration: 5600,
                                position: 'bottom-right',
                              },
                            )
                          }}
                        >
                          <CTableHeaderCell scope="row">
                            {index + 1}
                          </CTableHeaderCell>
                          <CTableDataCell>{item.name}</CTableDataCell>
                        </CTableRow>
                      ))
                  ) : (
                    <CTableRow>No tables in db</CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCol>
          </CRow>
        </CRow>
      )}
    </div>
  )
})

export default ProductSell
