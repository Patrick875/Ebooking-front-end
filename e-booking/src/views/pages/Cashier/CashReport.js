import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
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
import Pagination from 'src/utils/Pagination'
import ViewCashTransaction from './ViewCashTransaction'
import PrintHeader from '../Printing/PrintHeader'
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
                  Account /Purchase number
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
                      <CTableDataCell>
                        {order['description'].substring(0, 28)}
                      </CTableDataCell>
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
  const [newVersion, setNewVersion] = useState()
  const [viewRecords, setViewRecords] = useState(false)
  const [viewReport, setViewReport] = useState(false)
  const [update, setUpdate] = useState(true)
  const [viewTransaction, setViewTransaction] = useState(false)
  const [transaction, setTransaction] = useState(false)
  const time = watch('time') || 'all-time'
  const trans = watch('transaction') || ''
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
  const perpage = 30
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  useEffect(() => {
    const getCashTransactions = async () => {
      await instance.get('/cashflow/all').then((res) => {
        setTransactions(res.data.data)
      })
    }
    getCashTransactions()
  }, [newVersion])
  return (
    <div>
      <div className="d-flex justify-content-between">
        <CButton
          onClick={() => {
            setViewRecords(true)
            setViewReport(false)
            setViewTransaction(false)
          }}
        >
          All Transactions
        </CButton>
        <CButton
          onClick={() => {
            setViewRecords(false)
            setViewReport(true)
          }}
        >
          Report
        </CButton>
      </div>
      <div className="d-flex justify-content-between align-items-center my-2">
        <div className="col-2">
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-ghost-primary">Print</button>
            )}
            content={() => ref || componentRef.current}
          />
        </div>
        {viewTransaction ? (
          <div className="d-flex gap-2">
            <CButton
              className="btn-success px-4 btn-sm "
              onClick={() => {
                setUpdate(!update)
              }}
            >
              {!update ? 'Updating' : 'Update'}
            </CButton>
          </div>
        ) : null}
        {viewRecords && !viewTransaction ? (
          <div className="col-4">
            <label className="text-center py-1">Search </label>
            <CFormInput
              placeholder="...name or id"
              {...register('transaction')}
              type="text"
              name="transaction"
            />
          </div>
        ) : null}

        {!viewTransaction ? (
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
        ) : null}
      </div>

      <div ref={ref || componentRef}>
        {viewRecords && !viewReport ? (
          viewTransaction ? (
            <div>
              {' '}
              <ViewCashTransaction
                transaction={transaction}
                update={update}
                setNewVersion={setNewVersion}
                setUpdate={setUpdate}
              />{' '}
            </div>
          ) : (
            <div>
              <PrintHeader />
              <p className="text-center fw-bold text-uppercase">
                Cash Transactions
              </p>
              <div>
                <CTable bordered>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                      <CTableHeaderCell scope="col">To/From</CTableHeaderCell>
                      <CTableHeaderCell scope="col">By</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Reason</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {transactions && transactions.length !== 0
                      ? transactions
                          .filter((el) =>
                            el.transactionId.toLowerCase().includes(trans) ||
                            el.doneTo.toLowerCase().includes(trans)
                              ? el
                              : null,
                          )
                          .filter((trans) => {
                            return myDates.includes(
                              getUTCDateWithoutHours(trans.date),
                            )
                              ? trans
                              : null
                          })
                          .map((item, i) => {
                            return (
                              <CTableRow
                                key={item.id}
                                onClick={() => {
                                  setTransaction(item)
                                  setViewTransaction(true)
                                }}
                              >
                                <CTableHeaderCell scope="row">
                                  {new Date(item.date).toLocaleDateString()}
                                </CTableHeaderCell>
                                <CTableDataCell>
                                  {item.transactionId}
                                </CTableDataCell>
                                <CTableDataCell>{item.doneTo}</CTableDataCell>
                                <CTableDataCell>
                                  {item.User.firstName +
                                    ' ' +
                                    item.User.lastName}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {item.accountType}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {Number(item.amount).toLocaleString()}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {item.description}
                                </CTableDataCell>
                              </CTableRow>
                            )
                          })
                      : null}
                  </CTableBody>
                </CTable>
                {transactions.length !== 0 ? (
                  <Pagination
                    postsPerPage={perpage}
                    totalPosts={transactions.length}
                    paginate={paginate}
                  />
                ) : null}
              </div>
            </div>
          )
        ) : (
          <React.Fragment>
            <InvoiceHeader title="Cash flow" />
            <CashRecords
              time={time}
              myDates={myDates}
              transactions={transactions}
              balance={balance}
              startDate={startDate}
              endDate={endDate}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  )
})

export default CashReport

// <div style={{ display: 'none' }}>
//         <div ref={ref || componentRef}>
//           <InvoiceHeader title="Cash flow" />
//           <CashRecords
//             time={time}
//             myDates={myDates}
//             transactions={transactions}
//             startDate={startDate}
//             endDate={endDate}
//           />
//           <PrintFooterNoSignatures />
//         </div>
//       // </div>
