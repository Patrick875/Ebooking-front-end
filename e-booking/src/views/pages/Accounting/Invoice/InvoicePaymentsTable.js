import React from 'react'
import {
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import Pagination from 'src/utils/Pagination'
import { useState } from 'react'
import PrintHeader from '../../Printing/PrintHeader'
import {
  datesInRangeWithUnix,
  getUTCDateWithoutHours,
  groupByClientName,
} from 'src/utils/functions'
import BackButton from 'src/components/Navigating/BackButton'
import { useEffect } from 'react'
import { instance } from 'src/API/AxiosInstance'
import { useDispatch } from 'react-redux'
import { selectItem } from 'src/redux/Select/selectionActions'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import ReactDatePicker from 'react-datepicker'
import CalendarContainer from 'src/utils/CalendarContainer'

function InvoicePaymentsTable() {
  let [invoices, setInvoices] = useState([])
  const { register, watch } = useForm()
  let query = watch('query') || ''
  let time = watch('time') || ''
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const perpage = 30
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const onChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  const handleOnRowClick = async (item) => {
    dispatch(selectItem(item))
    navigate('/booking/accounting/invoice/view')
  }
  const totalPayments = (invoice) => {
    return invoice.InvoicePayments && invoice.InvoicePayments.length !== 0
      ? invoice.InvoicePayments.reduce((a, b) => a + b.amount, 0)
      : 0
  }
  let myDates = datesInRangeWithUnix(startDate, endDate)
  let stuff = []

  if (
    invoices &&
    invoices.length !== 0 &&
    myDates &&
    myDates.length !== 0 &&
    time !== 'all-time'
  ) {
    invoices = invoices.filter((invoice) =>
      myDates.includes(getUTCDateWithoutHours(invoice.createdAt))
        ? invoice
        : '',
    )
  } else {
    stuff =
      invoices && invoices.length !== 0
        ? invoices.filter((el, i) => {
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
  let allInvoices = groupByClientName(invoices)

  if (query && query !== '') {
    allInvoices = allInvoices.filter((invoice) =>
      invoice.clientName.toLowerCase().includes(query.toLowerCase()),
    )
  }

  useEffect(() => {
    const getAllInvoice = async () => {
      await instance
        .get('/invoices/all')
        .then((res) => {
          setInvoices(res.data.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    getAllInvoice()
  }, [])
  return (
    <div>
      <BackButton />
      <div className="col">
        <form>
          <CCol className="d-flex gap-2">
            <CCol md={3}>
              <CFormLabel className="text-center">Search</CFormLabel>
              <CFormInput
                className="mb-1"
                type="text"
                name="id"
                id="id/no"
                placeholder="by client name ..."
                {...register('query')}
              />
            </CCol>

            <div className="col-6 d-flex gap-2">
              <div className={`${time && time === 'date' ? 'col' : 'col-8'}`}>
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
              <div>
                {time && time === 'date' ? (
                  <React.Fragment>
                    <label className="text-center py-1">Date(s)</label>
                    <ReactDatePicker
                      className=" form-control col px-2"
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
                  </React.Fragment>
                ) : null}
              </div>
            </div>
          </CCol>
        </form>
      </div>
      <div>
        <p className="text-center fw-bold text-uppercase">Invoice payments</p>
        <div>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Function</CTableHeaderCell>
                <CTableHeaderCell scope="col">Total </CTableHeaderCell>
                <CTableHeaderCell scope="col">Paid</CTableHeaderCell>
                <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {allInvoices && allInvoices.length !== 0
                ? allInvoices.map((el, i) => {
                    return (
                      <React.Fragment key={i}>
                        <CTableRow>
                          <CTableHeaderCell colSpan={7}>
                            {el.clientName}
                          </CTableHeaderCell>
                        </CTableRow>
                        {el.invoices.map((item, i) => (
                          <CTableRow
                            key={item.id}
                            onClick={() => {
                              handleOnRowClick(item)
                            }}
                          >
                            <CTableDataCell>{i + 1}</CTableDataCell>
                            <CTableDataCell>
                              {item.invoiceGenerated}
                            </CTableDataCell>

                            <CTableHeaderCell scope="row">
                              {new Date(item.date).toLocaleDateString('fr-FR')}
                            </CTableHeaderCell>
                            <CTableDataCell>{item.function}</CTableDataCell>
                            <CTableDataCell>
                              {Number(item.vatTotal).toLocaleString()}
                            </CTableDataCell>

                            <CTableDataCell>
                              {Number(totalPayments(item)).toLocaleString()}
                            </CTableDataCell>
                            <CTableDataCell>
                              {Number(
                                item.vatTotal - totalPayments(item),
                              ).toLocaleString()}
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                        <CTableRow>
                          <CTableHeaderCell colSpan={2}>Total</CTableHeaderCell>
                          <CTableDataCell colSpan={2} />
                          <CTableHeaderCell>
                            {el.invoices
                              .reduce((a, b) => a + Number(b.vatTotal), 0)
                              .toLocaleString()}
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            {el.invoices
                              .reduce((a, b) => a + Number(totalPayments(b)), 0)
                              .toLocaleString()}
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            {Number(
                              el.invoices.reduce(
                                (a, b) => a + Number(b.vatTotal),
                                0,
                              ) -
                                el.invoices.reduce(
                                  (a, b) => a + Number(totalPayments(b)),
                                  0,
                                ),
                            ).toLocaleString()}
                          </CTableHeaderCell>
                        </CTableRow>
                      </React.Fragment>
                    )
                  })
                : null}
            </CTableBody>
          </CTable>
        </div>

        {allInvoices.length !== 0 ? (
          <Pagination
            postsPerPage={perpage}
            totalPosts={allInvoices.length}
            paginate={paginate}
          />
        ) : null}
      </div>
    </div>
  )
}

export default InvoicePaymentsTable
