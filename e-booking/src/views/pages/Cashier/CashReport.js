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
import ReactToPrint from 'react-to-print'
import PrintFooterNoSignatures from '../Printing/PrintFooterNoSignature'
import { instance } from 'src/API/AxiosInstance'
import { useForm } from 'react-hook-form'
import {
  datesInRangeWithUnix,
  getUTCDateWithoutHours,
} from 'src/utils/functions'
import ReactDatePicker from 'react-datepicker'
import CalendarContainer from 'src/utils/CalendarContainer'
import InvoiceHeader from '../Printing/InvoiceHeader'
const CashRecords = (props) => {
  let { transactions, time, myDates, startDate, endDate } = props
  let debitTotal, creditTotal, balance

  if (time && time === 'all-time') {
    debitTotal = transactions
      .filter((trans) => trans['accountType'] === 'DEBIT')
      .reduce((a, b) => a + b.amount, 0)
    creditTotal = transactions
      .filter((trans) => trans['accountType'] === 'CREDIT')
      .reduce((a, b) => a + b.amount, 0)
    balance = debitTotal - creditTotal
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
  }

  return (
    <div className="m-3 p-3">
      <h2 className="text-center my-3 text-uppercase fs-5 border border-2">
        Cash BOX REPORT{' '}
        {`${
          myDates.length === 1 && time !== 'all-time'
            ? ' on ' + new Date(myDates[0]).toLocaleDateString()
            : ' for ' +
              new Date(startDate).toLocaleDateString() +
              ' - ' +
              new Date(endDate).toLocaleDateString()
        }`}
      </h2>
      <CCardBody className="d-flex justify-content-around">
        <div className="col">
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="fs-6" scope="col">
                  Date
                </CTableHeaderCell>
                <CTableDataCell className="fs-6" scope="col">
                  #
                </CTableDataCell>
                <CTableDataCell className="fs-6" scope="col">
                  Account
                </CTableDataCell>
                <CTableDataCell className="fs-6" scope="col">
                  Purpose
                </CTableDataCell>
                <CTableDataCell className="fs-6" scope="col">
                  CASH IN
                </CTableDataCell>
                <CTableDataCell
                  className="fs-6"
                  style={{ fontSize: 10 }}
                  scope="col"
                >
                  CASH OUT
                </CTableDataCell>
                <CTableDataCell className="fs-6" scope="col">
                  BALANCE
                </CTableDataCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {transactions && transactions.length !== 0 ? (
                <React.Fragment>
                  <CTableRow>
                    <CTableDataCell colSpan={3}></CTableDataCell>
                    <CTableDataCell colSpan={3}>Initial Balance</CTableDataCell>
                    <CTableDataCell>
                      {transactions[0].prevBalance}
                    </CTableDataCell>
                  </CTableRow>
                  {transactions.map((order, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>
                        {new Date(order['date']).toLocaleDateString()}
                      </CTableDataCell>
                      <CTableDataCell>{i + 1}</CTableDataCell>
                      <CTableDataCell>{order['account']}</CTableDataCell>
                      <CTableDataCell>{order['description']}</CTableDataCell>
                      <CTableDataCell>
                        {order['accountType'] === 'DEBIT'
                          ? order['amount'].toLocaleString()
                          : 0}
                      </CTableDataCell>
                      <CTableDataCell>
                        {order['accountType'] === 'CREDIT'
                          ? order['amount'].toLocaleString()
                          : 0}
                      </CTableDataCell>
                      <CTableDataCell>
                        {order['newBalance'].toLocaleString()}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </React.Fragment>
              ) : null}

              <CTableRow>
                <CTableHeaderCell />
                <CTableHeaderCell />
                <CTableHeaderCell />
                <CTableHeaderCell>Closing Balance</CTableHeaderCell>
                <CTableHeaderCell>
                  {Number(debitTotal).toLocaleString()}
                </CTableHeaderCell>
                <CTableHeaderCell>
                  {Number(creditTotal).toLocaleString()}
                </CTableHeaderCell>
                <CTableDataCell>
                  {Number(balance).toLocaleString() === 'NaN'
                    ? balance
                    : Number(balance).toLocaleString()}{' '}
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
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
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
  let balance = debitTotal - creditTotal
  balance = balance.toLocaleString()

  useEffect(() => {
    const getCashTransactions = async () => {
      await instance.get('/cashflow/all').then((res) => {
        setTransactions(res.data.data)
        console.log('cash flow', res.data.data)
      })
    }
    getCashTransactions()
  }, [])
  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div className="col-2">
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-ghost-primary">Print</button>
            )}
            content={() => ref || componentRef.current}
          />
        </div>

        <div className=" col-md-4 d-flex justify-content-between gap-2">
          <div className="col">
            <label className="text-center py-1">Time</label>
            <select
              className="form-select form-select-sm col"
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
          <InvoiceHeader />
          <CashRecords
            time={time}
            myDates={myDates}
            transactions={transactions}
            startDate={startDate}
            endDate={endDate}
          />
          <PrintFooterNoSignatures />
        </div>
      </div>
      <CashRecords
        time={time}
        myDates={myDates}
        transactions={transactions}
        balance={balance}
        startDate={startDate}
        endDate={endDate}
      />
    </CCard>
  )
})

export default CashReport
