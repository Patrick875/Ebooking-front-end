import {
  CCard,
  CCardBody,
  CCardGroup,
  CCardHeader,
  CCardImage,
  CCardTitle,
} from '@coreui/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import daySales from '../../../assets/images/SVGs/daySales.svg'
function CreateReport() {
  const [title, setTitle] = useState('')
  const [columns, setColumns] = useState([
    { name: 'item', required: true, visible: true },
  ])

  return (
    <div>
      <CCard>
        <CCardTitle className="text-center my-3 text-uppercase">
          Choose report template
        </CCardTitle>
      </CCard>

      <Link
        className="gap-2 card-group  link-dark text-decoration-none text-center"
        to="/reports/create/daysales"
      >
        <CCard>
          <CCardImage orientation="top" src={daySales} />
          <CCardBody>
            <CCardTitle>Daily sales report</CCardTitle>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardImage orientation="top" src={daySales} />
          <CCardBody>
            <CCardTitle>Cashier report</CCardTitle>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardImage orientation="top" src={daySales} />
          <CCardBody>
            <CCardTitle>Stock report</CCardTitle>
          </CCardBody>
        </CCard>
      </Link>
    </div>
  )
}

export default CreateReport
