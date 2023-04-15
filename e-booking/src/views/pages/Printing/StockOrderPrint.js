import {
  CCard,
  CCardBody,
  CImage,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React from 'react'
import logo from '../../../assets/images/olympic_hotel_logo.png'
import { useSelector } from 'react-redux'

const StockOrderPrint = React.forwardRef((props, ref) => {
  const { title } = props
  let { purchaseOrderItems } = props
  const { firstName, lastName } = useSelector((state) => state.auth.user)
  const role = useSelector((state) => state.auth.role)

  const purchaseTotal =
    purchaseOrderItems && purchaseOrderItems.length !== 0
      ? purchaseOrderItems
          .reduce((acc, b) => acc + Number(b.quantity) * Number(b.price), 0)
          .toLocaleString()
      : 0

  return (
    <CCard ref={ref}>
      <div className="m-3 p-3">
        <div className="d-flex flex-col my-3">
          <p className="col">
            Done on{' '}
            {new Date().toLocaleDateString() +
              ' at  ' +
              new Date().toLocaleTimeString()}
          </p>
          <p className="col">eBooking</p>
        </div>

        <CRow className="col d-flex flex-row">
          <div className="col-4">
            <CImage src={logo} fluid alt="olympic hotel logo" />
          </div>
          <div className="col">
            <h3 className="fw-bolder text-capitalize">OLYMPIC HOTEL</h3>
            <p>TEL: +250 789 677 479/ +250 783 103 500</p>
            <p>E-mail:info@olympichotel.rw</p>
            <p>Website: www.olympichotel.rw</p>
            <p>TIN/VAT: 102556009</p>
          </div>
        </CRow>

        <h2 className="text-center my-3 text-capitalize">{title}</h2>

        <CCardBody className="d-flex justify-content-around">
          <div className="col">{props.children}</div>
        </CCardBody>

        <div className="my-4 d-flex justify-content-between">
          <div className="text-center">
            <p className="fw-bolder">Supplied by</p>
            <p className="fw-bolder text-uppercase">MARKET</p>
            <p className="my-2">................................</p>
          </div>
          <div className="text-center">
            <p className="fw-bolder">Received by</p>
            <p className="fw-bolder">(Name and Signature)</p>
            <p className="my-2">................................</p>
          </div>
          <div className="text-center">
            <p className="fw-bolder">ACCOUNTANT</p>
            <p className="fw-bolder">(Name and Signature)</p>
            <p className="my-2">................................</p>
          </div>
          <div className="text-center">
            <p className="fw-bolder">GENERAL MANAGER</p>
            <p className="fw-bolder">(Name and Signature)</p>
            <p className="my-2">................................</p>
          </div>
        </div>
        <div className="mt-2">
          <p>
            Printed by <span className="fw-bold text-capitalize"> {role}</span>:{' '}
            {firstName} {lastName}
          </p>
        </div>
      </div>
    </CCard>
  )
})

export default StockOrderPrint
