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

function AllDailySalesReports() {
  const dispatch = useDispatch()
  const [reports, setReports] = useState([])
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
                  reports.map((report, i) => (
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
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AllDailySalesReports
