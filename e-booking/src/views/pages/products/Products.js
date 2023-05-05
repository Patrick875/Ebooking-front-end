import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
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

const Products = () => {
  const { register } = useForm()
  const [editFields, setEditFields] = useState([])
  const role = useSelector((state) => state.auth.role)
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
                            <CTableHeaderCell scope="row">
                              {rowIndex + 1}
                            </CTableHeaderCell>
                            <CTableDataCell className="text-capitalize">
                              1 {pack.name} of {product.name}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                type="number"
                                name={`price for 1 ${pack.name} of ${product.name}`}
                                id={`price for 1 ${pack.name} of ${product.name}`}
                                defaultValue={pack.ProductPackage.price}
                                size="md"
                                readOnly={
                                  editFields[rowIndex] !== undefined &&
                                  !editFields[rowIndex]
                                }
                                {...register(
                                  `price_${pack.name}_${product.name}`,
                                )}
                              />
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
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Products

//to = '/booking/products/edit'

// const Products = () => {
//   const { register } = useForm()
//   const [editFields, setEditFields] = useState([])

//   let [products, setProducts] = useState([])

//   products =
//     products && products.length !== 0
//       ? products.sort((a, b) => {
//           if (a.name < b.name) {
//             return -1
//           }
//           if (a.name > b.name) {
//             return 1
//           }
//           return 0
//         })
//       : products

//   const deleteProduct = async (id) => {
//     await instance.delete(`/products/delete/${id}`).then(() => {
//       toast.success('product deleted!!!!')
//     })
//   }

//   let loggedInUser = useSelector((state) => state.auth.user.Role.name)

//   const setEditField = (index) => {
//     setEditFields(
//       editFields.map((field, i) => {
//         if (i === index) {
//           return !field
//         } else {
//           return field
//         }
//       })
//     )
//   }

//   return (
//     <CRow>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <h2>
//               <strong> All Products </strong>
//             </h2>
//           </CCardHeader>
//           <CCardBody>
//             <CTable bordered>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell scope="col">#</CTableHeaderCell>
//                   <CTableHeaderCell scope="col"> Name </CTableHeaderCell>
//                   <CTableHeaderCell scope="col"> Price</CTableHeaderCell>
//                   <CTableHeaderCell scope="col"> Option </CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {products.length !== 0
//                   ? products.map((product, el) => {
//                       return product.Packages.map((pack, i) => {
//                         const rowIndex = el + i
//                         return (
//                           <CTableRow key={product.name + 1}>
//                             <CTableHeaderCell scope="row">{rowIndex}</CTableHeaderCell>
//                             <CTableDataCell className="text-capitalize">
//                               1 {pack.name} of {product.name}
//                             </CTableDataCell>
//                             <CTableDataCell>
//                               <CFormInput
//                                 type="number"
//                                 name={`price for 1 ${pack.name} of ${product.name}`}
//                                 id={`price for 1 ${pack.name} of ${product.name}`}
//                                 defaultValue={pack.ProductPackage.price}
//                                 size="md"
//                                 readOnly={
//                                   editFields[rowIndex] !== undefined && !editFields[rowIndex]
//                                 }
//                                 {...register(
//                                   `price_${pack.name}_${product.name}`,
//                                 )}
//                               />
//                             </CTableDataCell>
//                             <CTableDataCell className="d-flex gap-3">
//                               <Link
//                                 className={`${
//                                   loggedInUser === 'controller'
//                                     ? 'disabled'
//                                     : ''
//                                 } btn btn-sm btn-warning`}
//                                 onClick={() => setEditField(rowIndex)}
//                               >
