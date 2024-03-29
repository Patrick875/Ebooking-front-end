import {
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import { selectStockItem } from 'src/redux/Select/selectStockItem'

import Pagination from 'src/utils/Pagination'

function AvailableStock() {
  const { register, watch } = useForm()
  const query = watch('query') || ''
  const storeId = watch('storeId') || ''
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const role = useSelector((state) => state.auth.role)

  const searchItems = (items, query) => {
    if (!query || query === '') {
      return items
    } else {
      return items.filter((item) =>
        item.StockItemNew.name.toLowerCase().includes(query.toLowerCase()),
      )
    }
  }
  const filterItems = (items, storeId) => {
    if (!storeId || storeId === '') {
      return items
    } else {
      return items.filter((item) => item.StockItemNew.storeId == storeId)
    }
  }
  let [items, setItems] = useState([])
  const [stores, setStores] = useState([])
  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  items = searchItems(items, query)
  items = filterItems(items, storeId)

  useEffect(() => {
    const getItems = async () => {
      await instance
        .get('/stock/item/balance')
        .then((res) => {
          setItems(res.data.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    const getStores = async () => {
      await instance
        .get('/stock/store/all')
        .then((res) => {
          setStores(res.data.data)
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    getItems()
    getStores()
  }, [])

  return (
    <div>
      <CCardHeader>
        <h2>
          <strong> Available stock </strong>
        </h2>
      </CCardHeader>

      <CCardBody>
        <form className="d-flex justify-content-between">
          <div className="col-md-4">
            <CFormInput
              className="mb-1"
              type="text"
              name="stockItemName"
              id="stockItemName"
              placeholder="search ..."
              {...register('query')}
            />
          </div>
          <div className="col-md-4">
            <CFormSelect
              name="store"
              id="store"
              className="mb-3"
              aria-label="store"
              {...register('storeId', { required: true })}
            >
              <option value="" selected={true}>
                All
              </option>
              {stores.length !== 0
                ? stores.map((store) => (
                    <option value={store.id} className="text-capitalize">
                      {store.name}
                    </option>
                  ))
                : null}
            </CFormSelect>
          </div>
        </form>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
              <CTableHeaderCell scope="col">Unit price</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items && items.length !== 0
              ? items
                  .sort((a, b) =>
                    a.StockItemNew.name > b.StockItemNew.name
                      ? 1
                      : a.StockItemNew.name < b.StockItemNew.name
                      ? -1
                      : 0,
                  )
                  .filter((el, i) => {
                    if (currentPage === 1) {
                      return i >= 0 && i < perpage ? el : null
                    } else {
                      return i >= (currentPage - 1) * perpage &&
                        i <= perpage * currentPage - 1
                        ? el
                        : null
                    }
                  })
                  .map((item, i) => {
                    return (
                      <CTableRow key={item.id}>
                        <CTableDataCell scope="row">
                          {(currentPage - 1) * perpage + 1 + i}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.StockItemNew ? item.StockItemNew.name : ''}
                        </CTableDataCell>
                        <CTableDataCell>{item.quantity}</CTableDataCell>
                        <CTableDataCell>
                          {' '}
                          {Number(item.price).toFixed(2)}
                        </CTableDataCell>
                        <CTableDataCell className="d-flex  gap-2">
                          <div
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              navigate('/booking/stock/item/history')
                              dispatch(selectStockItem(item))
                            }}
                          >
                            Track item
                          </div>
                          {![
                            'admin',
                            'Controller',
                            'Storekeeper',
                            'Cost - Controller ',
                            'General Manager - Olympic',
                          ].includes(role) ? null : (
                            <div
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                navigate('/booking/stock/items/value-update')
                                dispatch(selectStockItem(item))
                              }}
                            >
                              Update Item value
                            </div>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })
              : null}
          </CTableBody>
        </CTable>

        {items.length !== 0 ? (
          <Pagination
            postsPerPage={perpage}
            totalPosts={items.length}
            paginate={paginate}
          />
        ) : null}
      </CCardBody>
    </div>
  )
}

export default AvailableStock
