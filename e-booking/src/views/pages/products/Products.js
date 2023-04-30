import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectProduct } from 'src/redux/Product/productActions'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

const Products = () => {
  const dispatch = useDispatch()
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
  console.log('this is products', products)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> All Products </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Name </CTableHeaderCell>
                  <CTableHeaderCell scope="col">
                    {' '}
                    Price per package{' '}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Packages </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Option </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {products.length !== 0
                  ? products.map((product, i) => {
                      return (
                        <CTableRow>
                          <CTableHeaderCell scope="row">
                            {i + 1}
                          </CTableHeaderCell>
                          <CTableDataCell className="text-capitalize">
                            {' '}
                            {product.Packages.map((pack) => (
                              <div>
                                {' '}
                                1 {pack.name} of {product.name}
                              </div>
                            ))}{' '}
                          </CTableDataCell>

                          <CTableDataCell></CTableDataCell>
                          <CTableDataCell>
                            {' '}
                            {product.Packages.length !== 0
                              ? product.Packages.map((pack) => (
                                  <div>
                                    <p>{pack.name}</p>
                                  </div>
                                ))
                              : 'not set'}{' '}
                          </CTableDataCell>
                          <CTableDataCell className="d-flex gap-3">
                            <Link
                              to="/booking/products/edit"
                              className={`${
                                loggedInUser === 'controller' ? 'disabled' : ''
                              } btn btn-sm btn-warning`}
                              onClick={() => {
                                return dispatch(selectProduct(product))
                              }}
                            >
                              Edit
                            </Link>
                            <Link
                              className={`${
                                loggedInUser === 'controller' ? 'disabled' : ''
                              } btn btn-sm btn-danger`}
                              onClick={() => {
                                return deleteProduct(product.id)
                              }}
                            >
                              Delete
                            </Link>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })
                  : null}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Products
