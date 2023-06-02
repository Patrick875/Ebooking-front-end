import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import { selectItem } from 'src/redux/Select/selectionActions'
import Pagination from 'src/utils/Pagination'
import { sortingWithDates } from 'src/utils/functions'

function ReceiveVouchers() {
  const dispatch = useDispatch()
  const [receiveVauchers, setReceiveVauchers] = useState([])
  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  useEffect(() => {
    const getVauchers = async () => {
      await instance
        .get('/receive/voucher/all')
        .then((res) => {
          setReceiveVauchers(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getVauchers()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> All Receive vaucher </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col"> id </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Date </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Action </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {receiveVauchers && receiveVauchers.length !== 0 ? (
                  sortingWithDates(receiveVauchers)
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
                    .map((vaucher, i) => (
                      <CTableRow key={i}>
                        <CTableDataCell>
                          {' '}
                          {(currentPage - 1) * perpage + 1 + i}
                        </CTableDataCell>
                        <CTableDataCell>
                          {new Date(vaucher.date).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          <Link
                            to="/booking/stock/received/view"
                            className="btn btn-warning "
                            onClick={() => dispatch(selectItem(vaucher))}
                          >
                            view
                          </Link>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                ) : (
                  <CTableRow>
                    <CTableDataCell
                      colSpan={4}
                      className=" text-capitalize fw-bolder text-center"
                    >
                      {' '}
                      no receive vauchers in database
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
            {receiveVauchers.length !== 0 ? (
              <Pagination
                postsPerPage={perpage}
                totalPosts={receiveVauchers.length}
                paginate={paginate}
              />
            ) : null}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ReceiveVouchers
