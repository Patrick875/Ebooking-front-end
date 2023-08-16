import { CButton, CFormInput } from '@coreui/react'
import React, { useRef, useEffect, useState } from 'react'
import ReactToPrint from 'react-to-print'
import { instance } from 'src/API/AxiosInstance'
import { useForm } from 'react-hook-form'
import { datesInRangeWithUnix } from 'src/utils/functions'
import ReactDatePicker from 'react-datepicker'
import CalendarContainer from 'src/utils/CalendarContainer'
import ViewCashTransaction from './ViewCashTransaction'
import ReportByDepatment from './ReportByDepatment'
import AllCashRecords from './AllCashRecords'
import Transactions from './Transactions'

const CashReport = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const { register, watch } = useForm()
  const [newVersion, setNewVersion] = useState()
  const [accounts, setAccounts] = useState([])
  const [viewRecords, setViewRecords] = useState(false)
  const [viewReport, setViewReport] = useState(false)
  const [byDepartment, setByDepartment] = useState(false)
  const [update, setUpdate] = useState(true)
  const [viewTransaction, setViewTransaction] = useState(false)
  const [transaction, setTransaction] = useState(false)
  const time = watch('time') || 'all-time'
  const department = watch('department') || 'all'
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
        if (res && res.data && res.data.data) {
          setTransactions(res.data.data)
        }
      })
    }
    const getAccounts = async () => {
      await instance.get('/cashflow/account/all').then((res) => {
        if (res && res.data && res.data.data) {
          setAccounts(res.data.data)
          console.log('accounts', res.data.data)
        }
      })
    }
    getAccounts()
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
            setByDepartment(false)
          }}
        >
          All Transactions
        </CButton>
        <CButton
          onClick={() => {
            setByDepartment(true)
            setViewReport(false)
            setViewRecords(false)
            setViewTransaction(false)
          }}
        >
          By Department
        </CButton>
        <CButton
          onClick={() => {
            setViewRecords(false)
            setViewReport(true)
            setByDepartment(false)
          }}
        >
          Full Report
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
            {!byDepartment ? null : (
              <div className="col">
                <label className="text-center py-1">Department</label>
                <select
                  className="form-select form-select-sm col"
                  defaultValue={'all'}
                  {...register('department')}
                >
                  <option value="all">All</option>
                  {accounts.map((el) => (
                    <option value={el.id} key={el.id + el.name}>
                      {el.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
            <Transactions
              transactions={transactions}
              setViewTransaction={setViewTransaction}
              setTransaction={setTransaction}
              startDate={startDate}
              endDate={endDate}
              time={time}
              myDates={myDates}
            />
          )
        ) : (
          <React.Fragment>
            {byDepartment ? (
              <ReportByDepatment
                time={time}
                department={department}
                myDates={myDates}
                transactions={transactions}
                balance={balance}
                startDate={startDate}
                endDate={endDate}
                accounts={accounts}
              />
            ) : (
              <AllCashRecords
                time={time}
                myDates={myDates}
                transactions={transactions}
                balance={balance}
                startDate={startDate}
                endDate={endDate}
              />
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  )
})

export default CashReport
