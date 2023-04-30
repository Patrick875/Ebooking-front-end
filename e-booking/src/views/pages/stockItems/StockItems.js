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
import { Link } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import Pagination from 'src/utils/Pagination'

function StockItems() {
  const [items, setItems] = useState([])

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

  return (
    <div>
      <CCardHeader>
        <h2>
          <strong> Stock items </strong>
        </h2>
      </CCardHeader>
      <CCardBody>
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
