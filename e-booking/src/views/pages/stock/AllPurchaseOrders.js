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
import Pagination from 'src/utils/Pagination'
import { toast } from 'react-hot-toast'
import { RiCheckLine } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import { selectItem } from 'src/redux/Select/selectionActions'

function AllPurchaseOrders() {
  const [items, setItems] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const handleOnRowClick = async (item) => {
    dispatch(selectItem(item))
    navigate('/booking/stock/purchaseOrder/view')
  }
  useEffect(() => {
    const getPurchaseOrders = async () => {
      await instance
        .get('/purchase/order/all')
        .then((res) => {
          console.log(res.data)
          setItems(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getPurchaseOrders()
  }, [])

  return (
    <div>
      <CCardHeader>
        <h2>
          <strong> All Purchase orders </strong>
        </h2>
      </CCardHeader>
      <CCardBody>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Done by</CTableHeaderCell>
              <CTableHeaderCell scope="col">Payment</CTableHeaderCell>
              <CTableHeaderCell scope="col">Approval</CTableHeaderCell>
              <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
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
                      <CTableRow
                        key={item.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          return handleOnRowClick(item)
                        }}
                      >
                        <CTableHeaderCell scope="row">
                          {(currentPage - 1) * perpage + 1 + i}
                        </CTableHeaderCell>
                        <CTableDataCell>
                          {new Date(item.date).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.User.firstName + ' ' + item.User.lastName}
                        </CTableDataCell>
                        <CTableDataCell>Paid </CTableDataCell>
                        <CTableDataCell className="d-flex">
                          {item.status === 'APPROVED' ? (
                            <p className="ms-3">
                              Approved
                              <RiCheckLine className=" ms-3 text-success ri-lg" />
                            </p>
                          ) : (
                            <p className="ms-3">Pending</p>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.total.toLocaleString()}
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

export default AllPurchaseOrders