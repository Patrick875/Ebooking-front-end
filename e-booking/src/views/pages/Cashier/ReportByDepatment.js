import React from 'react'
import InvoiceHeader from '../Printing/InvoiceHeader'

const {
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
} = require('@coreui/react')

const ReportByDepatment = (props) => {
  let {
    department,
    accounts,
    transactions,
    time,
    myDates,
    startDate,
    endDate,
  } = props

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
      console.log('my-dates', myDates)
      return myDates.includes(new Date(trans.date).toLocaleDateString('fr-FR'))
        ? trans
        : null
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
    <div>
      <InvoiceHeader title="Cash flow" />
      <div className="m-3 p-3">
        <h2 className="text-center my-3 text-uppercase fs-5 border border-2">
          {department === 'all'
            ? 'CASH BOX BY DEPARTMENT'
            : department + 'DEPORT CASH REPORT'}{' '}
          {`${
            myDates.length === 1 && time !== 'all-time'
              ? ' on ' + new Date(myDates[0]).toLocaleDateString('fr-FR')
              : ' for ' +
                new Date(startDate).toLocaleDateString('fr-FR') +
                ' - ' +
                new Date(endDate).toLocaleDateString('fr-FR')
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
                  <CTableDataCell>#</CTableDataCell>

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
                    {accounts && accounts.length !== 0 && department === 'all'
                      ? accounts
                          .sort((a, b) => a.id - b.id)
                          .map((acc, i) => (
                            <React.Fragment>
                              <CTableRow key={i * 78}>
                                <CTableHeaderCell colSpan={6}>
                                  {acc.name}
                                </CTableHeaderCell>
                              </CTableRow>
                              {transactions
                                .filter((order) => order.account === acc.id)
                                .map((order, i) => (
                                  <CTableRow key={i}>
                                    <CTableDataCell>
                                      {new Date(
                                        order['date'],
                                      ).toLocaleDateString('fr-FR')}
                                    </CTableDataCell>
                                    <CTableDataCell>{i + 1}</CTableDataCell>
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
                                    <CTableDataCell />
                                  </CTableRow>
                                ))}
                              <CTableRow>
                                <CTableHeaderCell colSpan={2}>
                                  Total
                                </CTableHeaderCell>
                                <CTableDataCell colSpan={2} />
                                <CTableHeaderCell>
                                  {Number(
                                    Math.abs(acc.balance),
                                  ).toLocaleString()}
                                </CTableHeaderCell>
                              </CTableRow>
                            </React.Fragment>
                          ))
                      : accounts
                          .filter((a) => {
                            return a.id === Number(department)
                          })
                          .map((acc, i) => (
                            <React.Fragment>
                              <CTableRow key={i * 78}>
                                <CTableHeaderCell colSpan={6}>
                                  {acc.name}
                                </CTableHeaderCell>
                              </CTableRow>
                              {acc.CashFlows.filter(
                                (order) => order.account === acc.id,
                              ).map((order, i) => (
                                <CTableRow key={i}>
                                  <CTableDataCell>
                                    {new Date(order['date']).toLocaleDateString(
                                      'fr-FR',
                                    )}
                                  </CTableDataCell>
                                  <CTableDataCell>{i + 1}</CTableDataCell>
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
                                  <CTableDataCell />
                                </CTableRow>
                              ))}
                              <CTableRow>
                                <CTableHeaderCell colSpan={2}>
                                  Total
                                </CTableHeaderCell>
                                <CTableDataCell colSpan={2} />
                                <CTableDataCell>
                                  {Number(
                                    Math.abs(acc.balance),
                                  ).toLocaleString()}
                                </CTableDataCell>
                              </CTableRow>
                            </React.Fragment>
                          ))}
                  </React.Fragment>
                ) : null}

                {department === 'all' ? (
                  <CTableRow>
                    <CTableHeaderCell colSpan={2}>
                      Closing Balance
                    </CTableHeaderCell>
                    <CTableHeaderCell></CTableHeaderCell>
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
                ) : null}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </div>
    </div>
  )
}
export default ReportByDepatment
