import {
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormLabel,
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
import { Link } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import Pagination from 'src/utils/Pagination'

function StockItems() {
  const { register, watch } = useForm()
  const query = watch('query') || ''
  let [items, setItems] = useState([])

  const searchItems = (items, query) => {
    if (!query || query === '') {
      return items
    } else {
      return items.filter((item) => item.name.toLowerCase().includes(query))
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
    getItems()
  }, [])

  items = searchItems(items, query)
  return (
    <div>
      <CCardHeader>
        <h2>
          <strong> Stock items </strong>
        </h2>
      </CCardHeader>
      <CCardBody>
        <div className="col-md-4">
          <form>
            <CFormLabel className="text-center">Search</CFormLabel>
            <CFormInput
              className="mb-1"
              type="text"
              name="itemName"
              id="itemName"
              size="md"
              placeholder="by name ..."
              {...register('query')}
            />
          </form>
        </div>
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
                          <Link
                            className={` btn btn-sm btn-danger`}
                            onClick={() => {
                              return deleteStockItem(item.id)
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
