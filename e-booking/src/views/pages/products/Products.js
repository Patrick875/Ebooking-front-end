import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'

function ProductPriceUpdateModal(props) {
  let { open, setOpen, item } = props
  const { register, handleSubmit } = useForm()
  const updatePrice = async (data) => {
    data = { ...item, data }
    console.log('product update data', data)

    await instance
      .put('/api/v1/products/package/update', data)
      .then(() => {
        toast.success('product price updated !!!')
      })
      .catch(() => {
        toast.error('error updating product')
      })
  }
  return (
    <React.Fragment>
      <CModal
        size="lg"
        alignment="center"
        visible={open}
        onClose={() => setOpen(false)}
      >
        <CForm onSubmit={handleSubmit(updatePrice)}>
          <CModalHeader>
            <CModalTitle className="col text-center">
              Set new product price
            </CModalTitle>
          </CModalHeader>

          <CModalBody>
            <div className="ms-3 d-flex gap-2 justify-content-center">
              <div className="col-4">
                <CFormLabel htmlFor="oldPrice">Current price</CFormLabel>
                <CFormInput
                  className="form-control col px-2"
                  id="oldPrice"
                  name="oldPrice"
                  value={item.price}
                  type="number"
                  min={0}
                />
              </div>
              <div className="col-4">
                <CFormLabel htmlFor="price">New price</CFormLabel>

                <CFormInput
                  className="form-control col px-2"
                  id="price"
                  name="price"
                  {...register('price')}
                  type="number"
                  min={0}
                />
              </div>
            </div>
          </CModalBody>
          <CModalFooter>
            <button className="btn btn-primary" onClick={() => {}}>
              Update price
            </button>
          </CModalFooter>
        </CForm>
      </CModal>
    </React.Fragment>
  )
}

const Products = () => {
  const { register, watch } = useForm()
  const query = watch('query') || ''
  const [editFields, setEditFields] = useState([])
  const role = useSelector((state) => state.auth.role)
  const [clicked, setClicked] = useState({})
  const [open, setOpen] = useState(false)
  let [products, setProducts] = useState([])
  products =
    products && products.length !== 0
      ? products.sort((a, b) => {
          if (a.name < b.name) {
            return -1
          }
          if (a.name > b.name) {
            return 1
          }
          return 0
        })
      : products
  const deleteProduct = async (id) => {
    await instance.delete(`/products/delete/${id}`).then(() => {
      toast.success('product deleted!!!!')
    })
  }
  let loggedInUser = useSelector((state) => state.auth.user.Role.name)

  const setEditField = (index) => {
    setEditFields(
      editFields.map((field, i) => {
        if (i === index) {
          return !field
        } else {
          return field
        }
      }),
    )
  }

  if (query && query !== '') {
    products = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()),
    )
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
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <p className="fs-4 fw-bold">All Products</p>
            <div className="col-8 d-flex justify-content-end">
              <form className="col d-flex flex-wrap gap-2">
                <div className="col-3">
                  <CFormLabel className="text-center">Search</CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="productName"
                    id="productName"
                    size="md"
                    placeholder="by name ..."
                    {...register('query')}
                  />
                </div>
              </form>
            </div>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col"> Name </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Price</CTableHeaderCell>
                  {role && role === 'admin' ? (
                    <CTableHeaderCell scope="col"> Option </CTableHeaderCell>
                  ) : null}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {products.length !== 0
                  ? products.map((product, el) => {
                      return product.Packages.map((pack, i) => {
                        const rowIndex = el + i
                        return (
                          <CTableRow key={product.name + 1}>
                            <CTableDataCell className="text-capitalize">
                              1 {pack.name} of {product.name}
                            </CTableDataCell>
                            <CTableDataCell>
                              {pack.ProductPackage.price}
                            </CTableDataCell>

                            {role && role === 'admin' ? (
                              <CTableDataCell className="d-flex gap-3">
                                <Link
                                  className={`${
                                    loggedInUser === 'controller'
                                      ? 'disabled'
                                      : ''
                                  } btn btn-sm btn-warning`}
                                  onClick={() => {
                                    return setEditField(rowIndex)
                                  }}
                                >
                                  Edit
                                </Link>
                                <Link
                                  className={`${
                                    loggedInUser === 'controller'
                                      ? 'disabled'
                                      : ''
                                  } btn btn-sm btn-primary`}
                                  onClick={() => {
                                    setOpen(true)
                                    setClicked({
                                      product_id: product.id,
                                      package_id: pack.id,
                                      price: pack.ProductPackage.price,
                                    })
                                  }}
                                >
                                  Update price
                                </Link>
                                <Link
                                  className={`${
                                    loggedInUser === 'controller'
                                      ? 'disabled'
                                      : ''
                                  } btn btn-sm btn-danger`}
                                  onClick={() => {
                                    return deleteProduct(product.id)
                                  }}
                                >
                                  Delete
                                </Link>
                              </CTableDataCell>
                            ) : null}
                          </CTableRow>
                        )
                      })
                    })
                  : null}
              </CTableBody>
            </CTable>
            <ProductPriceUpdateModal
              open={open}
              item={clicked}
              setOpen={setOpen}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Products
