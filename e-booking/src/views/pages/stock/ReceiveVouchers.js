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
import React, { useEffect, useState, useMemo } from 'react'
import ReactDatePicker from 'react-datepicker'
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
  sortingWithDates,
} from 'src/utils/functions'

function ReceiveVouchers() {
  const dispatch = useDispatch()
  let [receiveVauchers, setReceiveVauchers] = useState([])
  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const { register, watch } = useForm()
  const time = watch('time')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const onChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  let myDates = useMemo(
    () => datesInRangeWithUnix(startDate, endDate),
    [time, startDate, endDate],
  )

  if (
    receiveVauchers &&
    receiveVauchers.length !== 0 &&
    myDates &&
    myDates.length !== 0 &&
    time !== 'all-time'
  ) {
    receiveVauchers = receiveVauchers.filter((vaucher) =>
      myDates.includes(
        getUTCDateWithoutHours(vaucher.date || vaucher.updatedAt),
      )
        ? vaucher
        : '',
    )
  }

  useEffect(() => {
    const getVauchers = async () => {
      await instance
        .get('/receive/voucher/all')
        .then((res) => {
          setReceiveVauchers(res.data.data)
        })
        .catch((err) => {
          console.log(err.message)
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

            <div className="d-flex justify-content-between  ">
              <div className="col-4 d-flex gap-2 flex-wrap">
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
                    <ReactDatePicker
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
            </div>
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
                          {new Date(vaucher.date).toLocaleDateString('fr-FR')}
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
