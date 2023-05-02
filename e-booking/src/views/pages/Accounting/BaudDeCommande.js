import {
  CCardBody,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { IoCreateOutline } from 'react-icons/io5'

import { Link } from 'react-router-dom'

function BaudDeCommande() {
  return (
    <div>
      <CCardBody>
        <CRow>
          <div className="d-flex justify-content-between my-3">
            <Link
              md={4}
              className="btn btn-primary"
              to="/booking/accounting/baud-de-commande/create"
            >
              <IoCreateOutline className="fs-5" />
              Create
            </Link>
          </div>
          <p className="text-center fs-4">
            <strong> All Baud de Commande </strong>
          </p>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">id</CTableHeaderCell>
                <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">To</CTableHeaderCell>
                <CTableHeaderCell scope="col">Prepared by</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody></CTableBody>
          </CTable>
        </CRow>
      </CCardBody>
    </div>
  )
}

export default BaudDeCommande
