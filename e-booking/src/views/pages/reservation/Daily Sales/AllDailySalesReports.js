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
import DatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import { selectItem } from 'src/redux/Select/selectionActions'
import CalendarContainer from 'src/utils/CalendarContainer'
import Pagination from 'src/utils/Pagination'
import {
  datesInRangeWithUnix,
  getUTCDateWithoutHours,
} from 'src/utils/functions'

function AllDailySalesReports() {
  const dispatch = useDispatch()
  const { register, watch } = useForm()
  const time = watch('time') || 'all-time'
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const onChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  let myDates = datesInRangeWithUnix(startDate, endDate)

  const getReportsByDate = (reports, dates) => {
    if (!time || time === 'all-time') {
      return reports
    } else {
      return reports.filter((report) =>
        dates.includes(getUTCDateWithoutHours(report.date)),
      )
    }
  }

  let [reports, setReports] = useState([])
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
  reports = getReportsByDate(reports, myDates)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> All Daily sales reports </strong>
            </h2>
            <div className="col-6 d-flex gap-2 flex-wrap">
              <div className="col">
                <label className="text-center py-1">Time</label>
                <select
                  className="form-select form-select-sm col"
                  aria-label="Default select example"
                  defaultValue={'all-time'}
                  {...register('time')}
                >
                  <option value="all-time">All-time</option>
                  <option value="date">Date</option>
                </select>
              </div>
              {time && time === 'date' ? (
                <div className="col d-flex align-items-end ">
                  <DatePicker
                    className="form-control col px-2"
                    onChange={onChange}
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd/MM/yy"
                    selectsRange
                    portalId="root-portal"
                    popperPlacement="bottom-end"
                    popperContainer={CalendarContainer}
                    placeholderText="Select date range"
                  />
                </div>
              ) : null}
            </div>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col"> # </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Date </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Done By </CTableHeaderCell>
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
                        <CTableDataCell>
                          {' '}
                          {(currentPage - 1) * perpage + 1 + i}
                        </CTableDataCell>
                        <CTableDataCell>
                          {new Date(report.date).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          {report.User.firstName + ' ' + report.User.lastName}
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
