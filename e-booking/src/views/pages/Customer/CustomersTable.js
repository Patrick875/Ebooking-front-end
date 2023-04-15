import { CTableDataCell, CTableHeaderCell, CTableRow } from '@coreui/react'
import React from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { instance, getTokenPromise } from 'src/API/AxiosInstance'
import { selectItem } from 'src/redux/Select/selectionActions'

function CustomersTable(props) {
  const { customers } = props
  const role = useSelector((state) => state.auth.role)
  const dispatch = useDispatch()
  const deleteCustomer = async (id) => {
    await instance
      .delete(`/customers/delete/${id}`)
      .then(() => {
        toast.success('Customer deleted successfully')
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }

  return customers && customers.length !== 0 ? (
    customers.map((customer, i) => (
      <CTableRow key={customer.id}>
        <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
        <CTableDataCell>{`${customer.names}`}</CTableDataCell>
        <CTableDataCell>{`${customer.identification}`}</CTableDataCell>

        {role && role === 'admin' ? (
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
            <Link
              to="/customers/edit"
              className="btn btn-warning text-decoration-none"
              onClick={() => {
                return dispatch(selectItem(customer))
              }}
            >
              Edit details
            </Link>{' '}
            <Link
              className="btn btn-danger text-decoration-none"
              onClick={() => deleteCustomer(customer.id)}
            >
              Delete
            </Link>{' '}
          </CTableDataCell>
        ) : null}
      </CTableRow>
    ))
  ) : (
    <CTableRow>
      <CTableDataCell colSpan={4}>No registered customer</CTableDataCell>
    </CTableRow>
  )
}

export default CustomersTable
