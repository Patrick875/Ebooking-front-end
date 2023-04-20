import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import PrintHeader from '../Printing/PrintHeader'
import PrintFooterSignatures from '../Printing/PrintFooterSignatures'
import PrintFooterNoSignatures from '../Printing/PrintFooterNoSignature'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import {
  datesInRangeWithUnix,
  getUTCDateWithoutHours,
} from 'src/utils/functions'
import ReactDatePicker from 'react-datepicker'
import CalendarContainer from 'src/utils/CalendarContainer'

const CashRecords = (props) => {
  let { transactions, balance, time, myDates } = props
  let debitTotal, creditTotal
  console.log('okay cool fine', myDates, time)
  if (time && time === 'all-time') {
    // totalAmount = transactions.reduce(
    //   (acc, b) => acc + b.amount,
    //   0,
    // )
    // totalPayments = transactions.reduce(
    //   (acc, b) => acc + b.amount,
    //   0,
    // )
  } else if (myDates && myDates.length !== 0) {
    transactions = transactions.filter((trans) => {
      return myDates.includes(getUTCDateWithoutHours(trans.date)) ? trans : null
    })

    debitTotal = transactions
      .filter((trans) => trans['accountType'] === 'DEBIT')
      .reduce((a, b) => a + b.amount, 0)
    creditTotal = transactions
      .filter((trans) => trans['accountType'] === 'CREDIT')
      .reduce((a, b) => a + b.amount, 0)
    balance = debitTotal - creditTotal
    // totalAmount = transactions.reduce(
    //   (acc, b) => acc + b.amount,
    //   0,
    // )
    // totalPayments = transactions.reduce(
    //   (acc, b) => acc + b.amount,
    //   0,
    // )
  }
  return (
    <div className="m-3 p-3">
      <h2 className="text-center my-3">Cash flow</h2>

      <CCardBody className="d-flex justify-content-around">
        <div className="col">
          <div className="d-flex">
            <p className="fw-bolder">Debit</p>
          </div>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                <CTableHeaderCell scope="col">From/To</CTableHeaderCell>
                <CTableHeaderCell scope="col">Account</CTableHeaderCell>
                <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {transactions && transactions.length !== 0
                ? transactions.map((order, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>{i + 1}</CTableDataCell>
                      <CTableDataCell>
                        {new Date(order['date']).toLocaleDateString()}
                      </CTableDataCell>
                      <CTableDataCell>{order['accountType']}</CTableDataCell>
                      <CTableDataCell>{order['doneTo']}</CTableDataCell>
                      <CTableDataCell>{order['account']}</CTableDataCell>
                      <CTableDataCell>{order['amount']}</CTableDataCell>
                    </CTableRow>
                  ))
                : null}

              <CTableRow>
                <CTableHeaderCell />
                <CTableHeaderCell colSpan={4}>Total</CTableHeaderCell>
                <CTableDataCell>
                  {Number(balance).toLocaleString() === 'NaN'
                    ? balance
                    : Number(balance).toLocaleString()}{' '}
                  RWF
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </div>
      </CCardBody>
    </div>
  )
}

const CashReport = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const { register, watch } = useForm()
  const time = watch('time') || 'all-time'
  const query = watch('query') || ''
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const onChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  let myDates = datesInRangeWithUnix(startDate, endDate)

  const [transactions, setTransactions] = useState([])

  const debitTotal =
    transactions && transactions.length !== 0
      ? transactions
          .filter((e) => e.accountType === 'DEBIT')
          .reduce((acc, b) => acc + b.amount, 0)
      : 0

  const creditTotal =
    transactions && transactions.length !== 0
      ? transactions
          .filter((e) => e.accountType === 'CREDIT')
          .reduce((acc, b) => acc + b.amount, 0)
      : 0

  console.log(creditTotal)
  let balance = debitTotal - creditTotal
  balance = balance.toLocaleString()

  useEffect(() => {
    const getCashTransactions = async () => {
      await instance.get('/cashflow/all').then((res) => {
        setTransactions(res.data.data)
      })
    }
    getCashTransactions()
  }, [])
  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div className="col">
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-ghost-primary">Print</button>
            )}
            content={() => ref || componentRef.current}
          />
        </div>

        <div className=" col d-flex justify-content-between gap-2">
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
      <div style={{ display: 'none' }}>
        <div ref={ref || componentRef}>
          <PrintHeader />
          <CashRecords
            time={time}
            myDates={myDates}
            transactions={transactions}
            debitTotal={debitTotal}
            creditTotal={creditTotal}
          />
          <PrintFooterNoSignatures />
        </div>
      </div>
      <CashRecords
        time={time}
        myDates={myDates}
        transactions={transactions}
        balance={balance}
      />
    </CCard>
  )
})

export default CashReport

//  <div ref={ref || componentRef}>
//           <PrintHeader />
//           <ReceiveVaucher
//             vaucher={vaucher}
//             receiveTotal={receiveTotal}
//             purchaseTotal={purchaseTotal}
//           />
//           <PrintFooterSignatures />
//           <PrintFooterNoSignatures />
//         </div>
