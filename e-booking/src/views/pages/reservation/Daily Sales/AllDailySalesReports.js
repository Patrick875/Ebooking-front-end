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

function AllDailySalesReports() {
  const dispatch = useDispatch()
  const [reports, setReports] = useState([])
  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  useEffect(() => {
    const getReports = async () => {
      await instance
        .get('/daily-sales/all')
        .then((res) => {
          setReports(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getReports()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> All Daily sales reports </strong>
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
                {reports && reports.length !== 0 ? (
                  reports
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
                    .map((report, i) => (
                      <CTableRow key={i}>
                        <CTableDataCell>{report.id}</CTableDataCell>
                        <CTableDataCell>
                          {new Date(report.date).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          <Link
                            to="/reports/receiption/view"
                            className="btn btn-warning "
                            onClick={() => dispatch(selectItem(report))}
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
                      no daily sales database
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
            {reports.length !== 0 ? (
              <Pagination
                postsPerPage={perpage}
                totalPosts={reports.length}
                paginate={paginate}
              />
            ) : null}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AllDailySalesReports
