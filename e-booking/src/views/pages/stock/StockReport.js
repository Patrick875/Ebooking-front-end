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
import React, { useEffect, useMemo, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'
import CalendarContainer from 'src/utils/CalendarContainer'
import Pagination from 'src/utils/Pagination'
import {
  datesInRangeWithUnix,
  getUTCDateWithoutHours,
} from 'src/utils/functions'
import InvoiceHeader from '../Printing/InvoiceHeader'
import PrintFooterNoSignatures from '../Printing/PrintFooterNoSignature'
import ReactToPrint from 'react-to-print'

function StockReportTable(props) {
  const { items, currentPage, perpage } = props
  const totalStock = (items) =>
    items.reduce((a, b) => a + Number(b.price * b.balance), 0)
  const total = useMemo(() => totalStock(items))

  return (
    <React.Fragment>
      <CTable bordered>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col"> # </CTableHeaderCell>
            <CTableHeaderCell scope="col"> ITEM NAME </CTableHeaderCell>
            <CTableHeaderCell scope="col"> OPENING </CTableHeaderCell>
            <CTableHeaderCell scope="col"> NEW STOCK </CTableHeaderCell>
            <CTableHeaderCell scope="col"> QTY OUT </CTableHeaderCell>
            <CTableHeaderCell scope="col"> CLOSING</CTableHeaderCell>
            <CTableHeaderCell scope="col"> U.P </CTableHeaderCell>
            <CTableHeaderCell scope="col"> T.P</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {items && items.length !== 0 ? (
            items
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
                    {' '}
                    {(currentPage - 1) * perpage + 1 + i}
                  </CTableDataCell>
                  <CTableDataCell>{item.StockItemNew.name}</CTableDataCell>
                  <CTableDataCell>{item.preQuantity}</CTableDataCell>
                  <CTableDataCell>
                    {items
                      .filter((el) => el.stockItem === item.stockItem)
                      .filter((el) => el.status === 'ADDED')
                      .reduce((a, b) => a + Number(b.newQuantity), 0)}
                  </CTableDataCell>

                  <CTableDataCell>
                    {items
                      .filter((el) => el.stockItem === item.stockItem)
                      .filter(
                        (el) =>
                          el.status === 'DEFAULT' || el.status === 'REMOVED',
                      ).length !== 0
                      ? items
                          .filter((el) => el.stockItem === item.stockItem)
                          .filter(
                            (el) =>
                              el.status === 'DEFAULT' ||
                              el.status === 'REMOVED',
                          )
                          .reduce((a, b) => a + Number(b.newQuantity),0)
                      : 0}
                  </CTableDataCell>
                  <CTableDataCell>{item.balance}</CTableDataCell>
                  <CTableDataCell>{item.price}</CTableDataCell>
                  <CTableDataCell>
                    {Number(item.price * item.balance).toLocaleString()}
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
          {Number(currentPage) === Math.ceil(Number(items.length / perpage)) ? (
            <CTableRow>
              <CTableDataCell
                colSpan={6}
                className=" text-uppercase fw-bolder text-center"
              >
                Total
              </CTableDataCell>
              <CTableDataCell>{total.toLocaleString()}</CTableDataCell>
            </CTableRow>
          ) : null}
        </CTableBody>
      </CTable>
    </React.Fragment>
  )
}

const StockReport = React.forwardRef((props, ref) => {
  const { register, watch } = useForm()
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
    const getStockHistory = async () => {
      await instance
        .get(`/stock/track/item`, {
          params: {
            date_from: startDate,
            date_to: endDate,
          },
        })
        .then((res) => {
          toast.success('all items details retrieved')
          setItems(res.data.data)
          console.log('all items', res.data.data)
        })
        .catch((err) => {
          toast.error('item details retrieve failed')
        })
    }

    getStockHistory()
  }, [])

  items = getReportsByDate(items, myDates)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between">
            <h2>
              {time === 'all-time' ? (
                <strong> All time stock report </strong>
              ) : (
                <strong>
                  {' '}
                  Stock report from{' '}
                  {startDate ? startDate.toLocaleDateString() : ''} to{' '}
                  {endDate ? endDate.toLocaleDateString() : ''}{' '}
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
                      ? 'STOCK REPORT FOR ALL TIME'
                      : `STOCK REPORT FROM ${
                          startDate ? startDate.toLocaleDateString() : ''
                        } to ${endDate ? endDate.toLocaleDateString() : ''}`
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

export default StockReport
