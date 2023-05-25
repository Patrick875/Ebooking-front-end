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
import ReactDatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import { instance } from 'src/API/AxiosInstance'
import BackButton from 'src/components/Navigating/BackButton'
import CalendarContainer from 'src/utils/CalendarContainer'
import Pagination from 'src/utils/Pagination'
import {
  datesInRangeWithUnix,
  getUTCDateWithoutHours,
} from 'src/utils/functions'

function AllServiceSells() {
  const { register, watch } = useForm()
  const [sells, setSells] = useState([])
  const time = watch('time')
  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const onChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  let myDates = datesInRangeWithUnix(startDate, endDate)
  //   let confirmedSells =
  //     sells && sells.length !== 0
  //       ? sells.filter((sell) => sell.status.toLowerCase() === 'comfirmed')
  //       : null

  //   if (
  //     confirmedSells &&
  //     confirmedSells.length !== 0 &&
  //     myDates &&
  //     myDates.length !== 0 &&
  //     time !== 'all-time'
  //   ) {
  //     confirmedSells = confirmedSells.filter((sell) =>
  //       myDates.includes(getUTCDateWithoutHours(sell.date)) ? sell : '',
  //     )
  //   } else {
  //     confirmedSells =
  //       confirmedSells && confirmedSells.length !== 0
  //         ? confirmedSells.filter((el, i) => {
  //             if (currentPage === 1) {
  //               return i >= 0 && i < perpage ? el : null
  //             } else {
  //               return i >= (currentPage - 1) * perpage &&
  //                 i <= perpage * currentPage - 1
  //                 ? el
  //                 : null
  //             }
  //           })
  //         : []
  //   }

  const total =
    sells && sells.length !== 0
      ? sells.reduce((acc, curr) => acc + curr.total, 0)
      : 0
  useEffect(() => {
    const getAllSells = async () => {
      await instance.get('/services/sells').then((res) => {
        setSells(res.data.data)
      })
    }
    getAllSells()
  }, [])

  return (
    <div>
      <BackButton />
      <CCardHeader className="d-flex align-items- ">
        <h2 className="col">
          <strong> All sells </strong>
        </h2>
        <div className="col d-flex gap-2 flex-wrap">
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
      </CCardHeader>
      <CCardBody>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Service</CTableHeaderCell>
              <CTableHeaderCell scope="col">Seller</CTableHeaderCell>
              <CTableHeaderCell scope="col">Client</CTableHeaderCell>
              <CTableHeaderCell scope="col">Total</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {sells && sells.length !== 0
              ? sells.map((item, i) => {
                  return (
                    <CTableRow key={item.id}>
                      <CTableHeaderCell scope="row">
                        {(currentPage - 1) * perpage + 1 + i}
                      </CTableHeaderCell>
                      <CTableDataCell>{item.Service.name}</CTableDataCell>
                      <CTableDataCell>
                        {item.User.firstName + ' ' + item.User.lastName}
                      </CTableDataCell>
                      <CTableDataCell>{item.client_name}</CTableDataCell>
                      <CTableDataCell>
                        {Number(item.total).toLocaleString()}
                      </CTableDataCell>
                    </CTableRow>
                  )
                })
              : null}

            <CTableRow>
              <CTableDataCell />
              <CTableDataCell colSpan={3}>Total</CTableDataCell>
              <CTableHeaderCell>
                {Number(total).toLocaleString()}
              </CTableHeaderCell>
            </CTableRow>
          </CTableBody>
        </CTable>
        {sells ? (
          <Pagination
            postsPerPage={perpage}
            totalPosts={sells.length}
            paginate={paginate}
          />
        ) : null}
      </CCardBody>
    </div>
  )
}

export default AllServiceSells
