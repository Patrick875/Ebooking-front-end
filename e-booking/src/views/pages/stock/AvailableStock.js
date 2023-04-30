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
import { instance, getTokenPromise } from 'src/API/AxiosInstance'
import Pagination from 'src/utils/Pagination'

function AvailableStock() {
  const [items, setItems] = useState([])
  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  useEffect(() => {
    const getItems = async () => {
      await instance
        .get('/stock/item/balance')
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
          <strong> Available stock </strong>
        </h2>
      </CCardHeader>
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
                        <CTableDataCell scope="row">
                          {(currentPage - 1) * perpage + 1 + i}
                        </CTableDataCell>
                        <CTableDataCell>{item.StockItem.name}</CTableDataCell>
                        <CTableDataCell>{item.quantity}</CTableDataCell>
                        <CTableDataCell>{item.price}</CTableDataCell>
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
