import { CTableDataCell, CTableHeaderCell, CTableRow } from '@coreui/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectItem } from 'src/redux/Select/selectionActions'

function CustomersTable(props) {
  const { customers, currentPage, perpage } = props
  const role = useSelector((state) => state.auth.role)
  const dispatch = useDispatch()

  return customers && customers.length !== 0 ? (
    customers.map((customer, i) => (
      <CTableRow key={customer.id}>
        <CTableHeaderCell scope="row">
          {' '}
          {(currentPage - 1) * perpage + 1 + i}
        </CTableHeaderCell>
        <CTableDataCell>{`${customer.names}`}</CTableDataCell>
        <CTableDataCell>{`${customer.identification}`}</CTableDataCell>

        <CTableDataCell className="d-flex gap-2">
          {' '}
          <Link
            to="/customers/info"
            className="btn btn-primary text-decoration-none"
            onClick={() => {
              return dispatch(selectItem(customer))
            }}
          >
            View
          </Link>{' '}
          {role && role === 'admin' ? (
            <React.Fragment>
              <Link
                to="/customers/edit"
                className="btn btn-warning text-decoration-none"
                onClick={() => {
                  return dispatch(selectItem(customer))
                }}
              >
                Edit details
              </Link>{' '}
            </React.Fragment>
          ) : null}
        </CTableDataCell>
      </CTableRow>
    ))
  ) : (
    <CTableRow>
      <CTableDataCell colSpan={4}>No registered customer</CTableDataCell>
    </CTableRow>
  )
}

export default CustomersTable
