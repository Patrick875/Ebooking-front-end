import {
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { instance, getTokenPromise } from 'src/API/AxiosInstance'
import { CATEGORY_ACTIONS } from 'src/redux/Categories/categoriesActionTypes'

function ProductCategories() {
  const dispatch = useDispatch()
  const result = useSelector((state) => state.categories.productCategories)
  const [items, setItems] = useState(result)
  const getCategories = async () => {
    await instance
      .get(`/products/category/all`)
      .then((res) => {
        console.log(res)
        setItems(res.data.data)
        dispatch({
          type: CATEGORY_ACTIONS.GET_PRODUCT_CATEGORIES,
          payload: res.data.data,
        })
      })
      .catch((err) => {
        console.log(err.message)
        dispatch({
          type: CATEGORY_ACTIONS.GET_PRODUCT_CATEGORIES,
          payload: [],
        })
      })
  }
  useEffect(() => {
    getCategories()
  }, [])

  return (
    <div>
      <CCardHeader>
        <h2>
          <strong> Product categories </strong>
        </h2>
      </CCardHeader>
      <CCardBody>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items && items.length !== 0 ? (
              items.map((item, i) => {
                return (
                  <CTableRow key={item.id}>
                    <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                    <CTableDataCell>{`${item.name}`}</CTableDataCell>
                  </CTableRow>
                )
              })
            ) : (
              <CTableRow className="text-center text-capitalize">
                no data avaialable
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </div>
  )
}

export default ProductCategories
