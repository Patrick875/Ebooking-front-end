import {
  CCardBody,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { IoCreateOutline } from 'react-icons/io5'
import { RiCheckLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'

import { Link, useNavigate } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import { selectItem } from 'src/redux/Select/selectionActions'
import CalendarContainer from 'src/utils/CalendarContainer'

import {
  datesInRangeWithUnix,
  getUTCDateWithoutHours,
  sortingWithDates,
} from 'src/utils/functions'
import CreateHotelEvent from './CreateHotelEvent'

function HotelEvents() {
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

  return (
    <div>
      <CreateHotelEvent />
    </div>
  )
}

export default HotelEvents
