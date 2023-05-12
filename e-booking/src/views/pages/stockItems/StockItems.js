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
import { CSVLink } from 'react-csv'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import Pagination from 'src/utils/Pagination'

function StockItems() {
  const { register, watch } = useForm()
  const query = watch('query') || ''
  const storeId = watch('storeId') || null
  let [items, setItems] = useState([])
  let [stores, setStores] = useState([])

  const searchItems = (items, query) => {
    if (!query || query === '') {
      return items
    } else {
      return items.filter((item) => item.name.toLowerCase().includes(query))
    }
  }
  const filterItems = (items, storeId) => {
    if (!storeId || storeId === '') {
      return items
    } else {
      return items.filter((item) => item.storeId == storeId)
    }
  }

  const deleteStockItem = async (id) => {
    await instance.delete(`/stock/item/delete/${id}`).then(() => {
      toast.success('item deleted!!!!')
    })
  }
  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const role = useSelector((state) => state.auth.role)
  useEffect(() => {
    const getItems = async () => {
      await instance
        .get('/stock/item/all')
        .then((res) => {
          setItems(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    const getStores = async () => {
      await instance
        .get('/stock/store/all')
        .then((res) => {
          setStores(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getStores()
    getItems()
  }, [])

  items = searchItems(items, query)
  items = filterItems(items, storeId)
  return (
    <div>
      <CCardHeader className="text-center">
        <h2>
          <strong> Stock items </strong>
        </h2>
      </CCardHeader>
      <div className="d-flex justify-content-end">
        <CSVLink
          data={items}
          headers={[{ label: 'Name', key: 'name' }]}
          filename="All-stock-item.csv"
          className="btn btn-primary "
        >
          Download in excell
        </CSVLink>
      </div>
      <CCardBody>
        <form className="d-flex justify-content-between">
          <div className="col-md-4">
            <CFormInput
              className="mb-1"
              type="text"
              name="itemName"
              id="itemName"
              size="md"
              placeholder="search ..."
              {...register('query')}
            />
          </div>
          <div className="col-md-4">
            <CFormSelect
              name="store"
              id="store"
              size="md"
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
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items && items.length !== 0
              ? items
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
                        <CTableHeaderCell scope="row">
                          {(currentPage - 1) * perpage + 1 + i}
                        </CTableHeaderCell>
                        <CTableDataCell>{`${item.name}`}</CTableDataCell>
                        <CTableDataCell className="d-flex ">
                          {role && role === 'admin' ? (
                            <Link
                              className={` btn btn-sm btn-danger`}
                              onClick={() => {
                                return deleteStockItem(item.id)
                              }}
                            >
                              Delete
                            </Link>
                          ) : null}
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

export default StockItems
