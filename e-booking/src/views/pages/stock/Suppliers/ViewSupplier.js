import {
  CButton,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import dayjs from 'dayjs'
import React from 'react'
import { useEffect, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { instance } from 'src/API/AxiosInstance'
import BackButton from 'src/components/Navigating/BackButton'
import CalendarContainer from 'src/utils/CalendarContainer'
import Pagination from 'src/utils/Pagination'
import { datesInRangeWithUnix } from 'src/utils/functions'

function ViewSupplier() {
  const { register, watch } = useForm()
  const time = watch('time')
  let stuff = []
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const onChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  let myDates = datesInRangeWithUnix(startDate, endDate)
  const perpage = 14
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const selectedSupplier = useSelector((state) => state.selection.selected)
  const [selectedList, setSelectedList] = useState()
  let availableLists =
    selectedSupplier &&
    selectedSupplier.SupplierLists &&
    selectedSupplier.SupplierLists.length !== 0
      ? selectedSupplier.SupplierLists
      : []
  const handleOnRowClick = (el) => {
    setSelectedList(el)
  }

  if (
    availableLists &&
    availableLists.length !== 0 &&
    myDates &&
    myDates.length !== 0 &&
    time !== 'all-time'
  ) {
    availableLists = availableLists.filter((list) => {
      const listDate = dayjs(list.date).format('DD/MM/YYYY')
      return myDates.includes(listDate) ? list : false
    })
  } else {
    stuff =
      availableLists && availableLists.length !== 0
        ? availableLists.filter((el, i) => {
            if (currentPage === 1) {
              return i >= 0 && i < perpage ? el : null
            } else {
              return i >= (currentPage - 1) * perpage &&
                i <= perpage * currentPage - 1
                ? el
                : null
            }
          })
        : []
  }

  return (
    <div>
      <div className="d-flex justify-content-between">
        <BackButton />
        {selectedList ? (
          <CButton
            style={{ backgroundColor: 'black' }}
            onClick={() => {
              setSelectedList(false)
            }}
          >
            Return to supply lists
          </CButton>
        ) : null}
      </div>

      <CCardBody>
        <div className="d-flex justify-content-between  ">
          <div className="col-3 d-flex gap-2 flex-wrap">
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

        <div className="my-3 p-3" style={{ border: '2px solid black' }}>
          <div>
            <div className="col my-0 py-0">
              <p className="my-0 py-0">
                {' '}
                Name :
                <span className="fw-bold "> {selectedSupplier.name} </span>
              </p>
              <p className="my-0 py-0">
                {' '}
                Tel :<span className="fw-bold ">{selectedSupplier.Tel}</span>
              </p>
            </div>
          </div>
        </div>
        {selectedList && Object.keys(selectedList).length !== 0 ? (
          <CRow>
            <p className="text-center fw-bold">
              Supply list of{' '}
              {new Date(selectedList.date).toLocaleDateString('fr-FR')}
            </p>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Item name </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Quantity </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {selectedList.SupplierListDetails &&
                selectedList.SupplierListDetails.length !== 0
                  ? selectedList.SupplierListDetails.map((el, i) => (
                      <CTableRow
                        onClick={() => {
                          handleOnRowClick(el)
                        }}
                      >
                        <CTableDataCell>{i + 1}</CTableDataCell>
                        <CTableDataCell>
                          {el.StockItemValue.StockItemNew.n}
                        </CTableDataCell>
                        <CTableDataCell>{el.quantity}</CTableDataCell>
                      </CTableRow>
                    ))
                  : null}
              </CTableBody>
            </CTable>
          </CRow>
        ) : null}
        {!selectedList ? (
          <CRow>
            <div>
              <CTable bordered>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col"> Date </CTableHeaderCell>
                    <CTableHeaderCell scope="col"> Total </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {availableLists && availableLists.length !== 0
                    ? availableLists.map((el, i) => (
                        <CTableRow
                          onClick={() => {
                            handleOnRowClick(el)
                          }}
                        >
                          <CTableDataCell>{i + 1}</CTableDataCell>
                          <CTableDataCell>
                            {new Date(el.date).toLocaleDateString('fr-FR')}
                          </CTableDataCell>
                          <CTableDataCell>
                            {Number(el.total).toLocaleString()}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    : stuff.map((el, i) => (
                        <CTableRow
                          onClick={() => {
                            handleOnRowClick(el)
                          }}
                        >
                          <CTableDataCell>{i + 1}</CTableDataCell>
                          <CTableDataCell>
                            {new Date(el.date).toLocaleDateString('fr-FR')}
                          </CTableDataCell>
                          <CTableDataCell>
                            {Number(el.total).toLocaleString()}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                </CTableBody>
              </CTable>
            </div>

            {availableLists ? (
              <Pagination
                postsPerPage={perpage}
                totalPosts={availableLists.length}
                paginate={paginate}
              />
            ) : null}
          </CRow>
        ) : null}
      </CCardBody>
    </div>
  )
}

export default ViewSupplier
