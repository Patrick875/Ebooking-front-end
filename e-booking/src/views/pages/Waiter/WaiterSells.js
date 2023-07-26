import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
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
import { useSelector } from 'react-redux'
import { instance } from 'src/API/AxiosInstance'
import BackButton from 'src/components/Navigating/BackButton'
import CalendarContainer from 'src/utils/CalendarContainer'
import Pagination from 'src/utils/Pagination'
import {
  datesInRangeWithUnix,
  getUTCDateWithoutHours,
} from 'src/utils/functions'

function WaiterSells() {
  const { register, watch } = useForm()
  const time = watch('time')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const onChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  let myDates = datesInRangeWithUnix(startDate, endDate)

  const getSalesByDate = (reports, dates) => {
    if (!time || time === 'all-time') {
      return reports
    } else {
      return reports.filter((report) =>
        dates.includes(getUTCDateWithoutHours(report.date)),
      )
    }
  }

  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  let [waiterSells, setWaiterSells] = useState([])
  const roleId = useSelector((state) => state.auth.user.Role.id)

  waiterSells = getSalesByDate(waiterSells, myDates)

  useEffect(() => {
    const getWaiterSells = async () => {
      await instance
        .get(`/products/package/waiter/sells/${roleId}`)
        .then((res) => {
          setWaiterSells(res.data.data)
        })
        .catch(() => {
          toast.error('failed getting waiter sells')
        })
    }
    getWaiterSells()
  }, [])
  return (
    <div>
      <CCol xs={12}>
        <BackButton />
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> My sales </strong>
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
                  <CTableHeaderCell scope="col"> Status </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Account </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Product </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Total </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {waiterSells && waiterSells.length !== 0 ? (
                  waiterSells
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
                    .map((sale, i) => (
                      <CTableRow key={i}>
                        <CTableDataCell>
                          {(currentPage - 1) * perpage + 1 + i}
                        </CTableDataCell>
                        <CTableDataCell>
                          {new Date(sale.date).toLocaleDateString('fr-FR')}
                        </CTableDataCell>
                        <CTableDataCell>{sale.status}</CTableDataCell>
                        <CTableDataCell>{sale.petitStock.name}</CTableDataCell>
                        <CTableDataCell>
                          {sale.petitStockSaleDetails.map((item, i) => (
                            <p key={i * 100}>
                              {item.quantity} {item.Package.name} of{' '}
                              {item.Package.Products.name}
                            </p>
                          ))}
                        </CTableDataCell>
                        <CTableDataCell>
                          {sale.amount.toLocaleString()}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                ) : (
                  <CTableRow>
                    <CTableDataCell
                      colSpan={5}
                      className=" text-capitalize fw-bolder text-center"
                    >
                      {' '}
                      No registered sells in db
                    </CTableDataCell>
                  </CTableRow>
                )}
                <CTableRow>
                  <CTableDataCell />
                  <CTableHeaderCell colSpan={4}>Total</CTableHeaderCell>
                  <CTableHeaderCell>
                    {waiterSells
                      .reduce((a, b) => a + Number(b.amount), 0)
                      .toLocaleString()}{' '}
                    Rwf
                  </CTableHeaderCell>
                </CTableRow>
              </CTableBody>
            </CTable>
            {waiterSells.length !== 0 ? (
              <Pagination
                postsPerPage={perpage}
                totalPosts={waiterSells.length}
                paginate={paginate}
              />
            ) : null}
          </CCardBody>
        </CCard>
      </CCol>
    </div>
  )
}

export default WaiterSells
