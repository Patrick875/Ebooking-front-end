import {
  CCardBody,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
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
import { toast } from 'react-hot-toast'
import { IoCreateOutline } from 'react-icons/io5'
import { RiCheckLine } from 'react-icons/ri'
import { useDispatch } from 'react-redux'

import { Link, useNavigate } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import { selectItem } from 'src/redux/Select/selectionActions'
import CalendarContainer from 'src/utils/CalendarContainer'
import Pagination from 'src/utils/Pagination'
import {
  datesInRangeWithUnix,
  getUTCDateWithoutHours,
  sortingWithDates,
} from 'src/utils/functions'

function Invoice() {
  let stuff = []
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { register, watch } = useForm()
  const query = watch('query') || ''
  const time = watch('time') || ''
  const status = watch('status') || ''
  const onChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  let [invoices, setInvoices] = useState([])
  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  let myDates = datesInRangeWithUnix(startDate, endDate)

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

  const handleOnRowClick = async (item) => {
    dispatch(selectItem(item))
    navigate('/booking/accounting/invoice/view')
  }
  if (invoices && invoices.length) {
    invoices = invoices.map((invoice) => {
      if (invoice && invoice.InvoicePayments.length !== 0) {
        let allPayment = invoice.InvoicePayments.reduce(
          (acc, b) => acc + b.amount,
          0,
        )
        if (allPayment < invoice.total) {
          invoice.status = `pending`
        } else {
          invoice.status = 'Completely paid'
        }
        return invoice
      } else {
        return invoice
      }
    })
  }
  if (query && query !== '') {
    invoices = invoices.filter(
      (invoice) =>
        invoice.invoiceGenerated.toLowerCase().includes(query.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(query.toLowerCase()),
    )
  }
  invoices =
    invoices && invoices.length !== 0 && status !== ''
      ? invoices.filter((invoice) =>
          invoice.status.toLowerCase().includes(status.toLowerCase()),
        )
      : invoices

  const totalPayments = (invoice) => {
    return invoice.InvoicePayments && invoice.InvoicePayments.length !== 0
      ? invoice.InvoicePayments.reduce((a, b) => a + b.amount, 0)
      : 0
  }

  useEffect(() => {
    const getAllInvoice = async () => {
      await instance
        .get('/invoices/all')
        .then((res) => {
          setInvoices(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getAllInvoice()
  }, [])

  return (
    <div>
      <CCardBody>
        <CRow>
          <CRow>
            <div className="d-flex justify-content-center">
              <Link
                md={4}
                className="btn btn-primary"
                to="/booking/accounting/invoice/create"
              >
                <IoCreateOutline className="fs-5" />
                Create
              </Link>
            </div>
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
                      placeholder="by id or client name ..."
                      {...register('query')}
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel className="text-center">Filter</CFormLabel>
                    <CFormSelect
                      className="mb-1"
                      type="text"
                      name="status"
                      id="status"
                      placeholder="by status"
                      {...register('status')}
                    >
                      <option value="" className="text-capitalize">
                        All
                      </option>
                      <option value="pending" className="text-capitalize">
                        pending
                      </option>
                      <option
                        value="Completely paid"
                        className="text-capitalize"
                      >
                        paid
                      </option>
                    </CFormSelect>
                  </CCol>
                  <div className="col-6 d-flex gap-2">
                    <div
                      className={`${time && time === 'date' ? 'col' : 'col-8'}`}
                    >
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
          </CRow>
          <p className="text-center fs-4">
            <strong> All invoices </strong>
          </p>
          <CTable bordered hover={true}>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">id</CTableHeaderCell>
                <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Created by</CTableHeaderCell>
                <CTableHeaderCell scope="col">Client </CTableHeaderCell>
                <CTableHeaderCell scope="col">Function</CTableHeaderCell>
                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                <CTableHeaderCell scope="col">Total</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {invoices && invoices.length !== 0
                ? sortingWithDates(invoices)
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
                    .map((el, i) => (
                      <CTableRow
                        key={i}
                        onClick={() => {
                          handleOnRowClick(el)
                        }}
                      >
                        <CTableDataCell>
                          {' '}
                          {(currentPage - 1) * perpage + 1 + i}
                        </CTableDataCell>
                        <CTableDataCell>{el.invoiceGenerated}</CTableDataCell>
                        <CTableDataCell>
                          {new Date(el.createdAt).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          {el.User.firstName + ' ' + el.User.lastName}
                        </CTableDataCell>
                        <CTableDataCell>{el.clientName}</CTableDataCell>
                        <CTableDataCell>{el.function}</CTableDataCell>
                        <CTableDataCell>
                          {el.InvoicePayments.length === 0 ? (
                            <p>PENDING</p>
                          ) : Number(totalPayments(el)) ===
                            Number(el.amount) ? (
                            <p className="ms-3">
                              Paid
                              <RiCheckLine className=" ms-3 text-success ri-lg" />
                            </p>
                          ) : (
                            <p>
                              {Number(totalPayments(el)).toLocaleString()} paid
                            </p>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {Number(el.total).toLocaleString()}
                          {' ' + el.currency}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                : ''}
            </CTableBody>
          </CTable>
          <Pagination
            postsPerPage={perpage}
            totalPosts={invoices.length}
            paginate={paginate}
          />
        </CRow>
      </CCardBody>
    </div>
  )
}

export default Invoice
