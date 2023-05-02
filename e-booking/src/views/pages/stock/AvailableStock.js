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
import { instance } from 'src/API/AxiosInstance'
import Pagination from 'src/utils/Pagination'

function AvailableStock() {
  const { register, watch } = useForm()
  const query = watch('query') || ''
  const searchItems = (items, query) => {
    if (!query || query === '') {
      return items
    } else {
      return items.filter((item) =>
        item.StockItem.name.toLowerCase().includes(query),
      )
    }
  }
  let [items, setItems] = useState([])

  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  items = searchItems(items, query)
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
        <div className="col-md-4">
          <CFormLabel className="text-center">Search</CFormLabel>
          <CFormInput
            className="mb-1"
            type="text"
            name="stockItemName"
            id="stockItemName"
            size="md"
            placeholder="by  item name ..."
            {...register('query')}
          />
        </div>

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
