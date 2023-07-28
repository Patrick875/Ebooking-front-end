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
import React, { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'
import CalendarContainer from 'src/utils/CalendarContainer'
import Pagination from 'src/utils/Pagination'
import {
  datesInRangeWithUnix,
  getUTCDateWithoutHours,
  sortingWithDates,
} from 'src/utils/functions'
import InvoiceHeader from '../Printing/InvoiceHeader'
import PrintFooterNoSignatures from '../Printing/PrintFooterNoSignature'
import ReactToPrint from 'react-to-print'
import BackButton from 'src/components/Navigating/BackButton'
import { useSelector } from 'react-redux'

function StockReportTable(props) {
  const { items, currentPage, perpage } = props
  return (
    <React.Fragment>
      <CTable bordered>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col"> # </CTableHeaderCell>
            <CTableHeaderCell scope="col"> DATE </CTableHeaderCell>
            <CTableHeaderCell scope="col"> PRICE </CTableHeaderCell>
            <CTableHeaderCell scope="col"> OPERATION </CTableHeaderCell>
            <CTableHeaderCell scope="col"> IN</CTableHeaderCell>
            <CTableHeaderCell scope="col"> OUT </CTableHeaderCell>
            <CTableHeaderCell scope="col"> CLOSING </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {items && items.length !== 0 ? (
            sortingWithDates(items)
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
              .map((item, i) => (
                <CTableRow key={i}>
                  <CTableDataCell>
                    {(currentPage - 1) * perpage + 1 + i}
                  </CTableDataCell>
                  <CTableDataCell>
                    {new Date(item.date).toLocaleDateString('fr-FR')}
                  </CTableDataCell>
                  <CTableDataCell>{item.price}</CTableDataCell>
                  <CTableDataCell>
                    {item && item.status === 'ADDED'
                      ? `Receiving (Moved in)  ${Math.abs(
                          Number(item.newQuantity),
                        )}`
                      : item && item.status === 'QUANTITY UPDATE'
                      ? item.status
                      : `Consumption (Moved out)  ${Math.abs(
                          Number(item.newQuantity),
                        )}`}
                  </CTableDataCell>
                  <CTableDataCell>
                    {item.status === 'ADDED'
                      ? Math.abs(Number(item.newQuantity))
                      : '0'}
                  </CTableDataCell>
                  <CTableDataCell>
                    {item.status === 'REMOVED'
                      ? `-${Math.abs(Number(item.newQuantity))}`
                      : '0'}
                  </CTableDataCell>
                  <CTableDataCell>
                    {i === items.length - 1 || item.preQuantity === 0
                      ? item.newQuantity
                      : item.balance}
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
                no stock history available
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </React.Fragment>
  )
}

const StockItemTrack = React.forwardRef((props, ref) => {
  const { register, watch } = useForm()
  const item = useSelector((state) => state.selection.selectedStockItem) || {}
  const componentRef = useRef()
  const time = watch('time') || 'all-time'
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), 0, 1),
  )
  const [endDate, setEndDate] = useState(new Date())
  const onChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  let myDates = datesInRangeWithUnix(startDate, endDate)

  const getReportsByDate = (items, dates) => {
    if (!time || time === 'all-time') {
      return items
    } else {
      return items.filter((item) =>
        dates.includes(getUTCDateWithoutHours(item.date)),
      )
    }
  }

  let [items, setItems] = useState([])
  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  useEffect(() => {
    if (item && Object.keys(item).length !== 0) {
      const getStockItemHistory = async () => {
        await instance
          .get(`/stock/track/item`, {
            params: {
              item: item.StockItemNew.id,
              date_from: startDate,
              date_to: endDate,
            },
          })
          .then((res) => {
            toast.success('all items details retrieved')
            setItems(res.data.data)
            console.log('res', res.data.data)
          })
          .catch((err) => {
            console.log('err', err)
          })
      }

      getStockItemHistory()
    }
  }, [])

  items = getReportsByDate(items, myDates)

  return (
    <CRow>
      <CCol xs={12}>
        <BackButton />
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between">
            <h2>
              {time === 'all-time' ? (
                <strong>
                  {' '}
                  All time report for {item ? item.StockItemNew.name : ''}{' '}
                </strong>
              ) : (
                <strong>
                  {' '}
                  Stock report of {item ? item.StockItemNew.name : ''} from{' '}
                  {startDate ? startDate.toLocaleDateString('fr-FR') : ''} to{' '}
                  {endDate ? endDate.toLocaleDateString('fr-FR') : ''}{' '}
                </strong>
              )}
            </h2>
            <div>
              <ReactToPrint
                trigger={() => (
                  <button className="btn btn-ghost-primary">Print</button>
                )}
                content={() => ref || componentRef.current}
              />
            </div>
          </CCardHeader>
          <div className="ps-3 col-6 d-flex gap-2 flex-wrap">
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
          <CCardBody>
            <div style={{ display: 'none' }}>
              <div ref={ref || componentRef}>
                <InvoiceHeader
                  documentTitle={
                    time === 'all-time'
                      ? `STOCK REPORT OF ${
                          item && item.StockItemNew.name
                        } FOR ALL TIME`
                      : `STOCK REPORT OF ${
                          item && item.StockItemNew.name
                        } FROM ${
                          startDate ? startDate.toLocaleDateString('fr-FR') : ''
                        } to ${
                          endDate ? endDate.toLocaleDateString('fr-FR') : ''
                        }`
                  }
                />
                <StockReportTable
                  items={items}
                  currentPage={1}
                  perpage={100000000000}
                />
                <PrintFooterNoSignatures />
              </div>
            </div>
            <StockReportTable
              items={items}
              currentPage={currentPage}
              perpage={perpage}
            />

            {items.length !== 0 ? (
              <Pagination
                postsPerPage={perpage}
                totalPosts={items.length}
                paginate={paginate}
              />
            ) : null}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
})

export default StockItemTrack
