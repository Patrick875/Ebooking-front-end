import {
  CButton,
  CCardBody,
  CFormInput,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { BiCartDownload } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import BackButton from 'src/components/Navigating/BackButton'
import { selectStockItem } from 'src/redux/Select/selectStockItem'

import Pagination from 'src/utils/Pagination'
function StoreView() {
  const { register, watch } = useForm()
  const query = watch('query') || ''
  const store = useSelector((state) => state.selection.selectedStore) || {}
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const searchItems = (items, query) => {
    if (!query || query === '') {
      return items
    } else {
      return items.filter((item) =>
        item.StockItemNew.name.toLowerCase().includes(query),
      )
    }
  }
  let [items, setItems] = useState([])

  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const [style, setStyle] = useState({ display: 'none' })
  items = searchItems(items, query)
  const deleteStore = async (id) => {
    await instance
      .delete(`/stock/store/delete/${id}`)
      .then(() => {
        toast.success('store deleted')
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }
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
    getItems()
  }, [])

  return (
    <div>
      <div className="d-flex justify-content-between">
        <BackButton />
        <CButton
          className="btn-danger"
          onClick={() => {
            deleteStore(store.id)
          }}
        >
          Delete store
        </CButton>
      </div>
      <CRow className="bg-white shadow shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
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
          <p className="text-center fs-4">
            <strong className="text-capitalize">
              {' '}
              {store && Object.keys(store).length !== 0
                ? store.name + ' stock'
                : 'Current stock'}{' '}
            </strong>
          </p>
          <div className="col-4 d-flex  justify-content-end my-3 gap-2 ">
            {Object.keys(store).length !== 0 && store.status !== 'DISACTIVE' ? (
              <Link
                md={4}
                className="btn btn-primary"
                to="/booking/store/purchase"
              >
                <BiCartDownload className="fs-5" />
              </Link>
            ) : null}
          </div>
        </div>
      </CRow>
      <CCardBody>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
              <CTableHeaderCell scope="col">Unit price</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {store &&
            Object.keys(store).length !== 0 &&
            store.StockItemNews &&
            store.StockItemNews.length !== 0
              ? store.StockItemNews.filter((el, i) => {
                  if (currentPage === 1) {
                    return i >= 0 && i < perpage ? el : null
                  } else {
                    return i >= (currentPage - 1) * perpage &&
                      i <= perpage * currentPage - 1
                      ? el
                      : null
                  }
                }).map((item, i) => {
                  return (
                    <CTableRow key={item.id}>
                      <CTableDataCell scope="row">
                        {(currentPage - 1) * perpage + 1 + i}
                      </CTableDataCell>
                      <CTableDataCell>{item.name}</CTableDataCell>
                      <CTableDataCell>
                        {item.StockItemValues &&
                        item.StockItemValues.length !== 0
                          ? item.StockItemValues[0].quantity
                          : '0'}
                      </CTableDataCell>
                      <CTableDataCell
                        onMouseEnter={(e) => {
                          setStyle({ display: 'block' })
                        }}
                        onMouseLeave={(e) => {
                          setStyle({ display: 'none' })
                        }}
                        className="d-flex  gap-2"
                      >
                        {item.StockItemValues &&
                        item.StockItemValues.length !== 0
                          ? item.StockItemValues[0].price
                          : '0'}
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
            totalPosts={store.StockItemNews.length}
            paginate={paginate}
          />
        ) : null}
      </CCardBody>
    </div>
  )
}

export default StoreView
