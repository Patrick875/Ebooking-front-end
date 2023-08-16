import React from 'react'
import PrintHeader from '../Printing/PrintHeader'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import Pagination from 'src/utils/Pagination'
import { useState } from 'react'

function Transactions(props) {
  const { setTransaction, setViewTransaction, myDates } = props
  let { transactions } = props
  transactions =
    myDates && myDates.length !== 0
      ? transactions.filter((el) =>
          myDates.includes(new Date(el.date).toLocaleDateString('fr-FR')),
        )
      : transactions

  const perpage = 30
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div>
      {' '}
      <div>
        <PrintHeader />
        <p className="text-center fw-bold text-uppercase">Cash Transactions</p>
        <div>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                <CTableHeaderCell scope="col">To/From</CTableHeaderCell>
                <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                <CTableHeaderCell scope="col">Reason</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {transactions && transactions.length !== 0
                ? transactions.map((item, i) => {
                    return (
                      <CTableRow
                        key={item.id}
                        onClick={() => {
                          setTransaction(item)
                          setViewTransaction(true)
                        }}
                      >
                        <CTableHeaderCell scope="row">
                          {new Date(item.date).toLocaleDateString('fr-FR')}
                        </CTableHeaderCell>
                        <CTableDataCell>{item.transactionId}</CTableDataCell>
                        <CTableDataCell>{item.doneTo}</CTableDataCell>

                        <CTableDataCell>{item.accountType}</CTableDataCell>
                        <CTableDataCell>
                          {Number(item.amount).toLocaleString()}
                        </CTableDataCell>
                        <CTableDataCell>{item.description}</CTableDataCell>
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
    </div>
  )
}

export default Transactions
