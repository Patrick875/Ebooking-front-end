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
import { useSelector } from 'react-redux'
import logo from '../../../assets/images/olympic_hotel_logo.png'
import PrintFooterSignatures from './PrintFooterSignatures'
import PrintFooterNoSignatures from './PrintFooterNoSignature'
const ReceiveVaucherPrint = React.forwardRef((props, ref) => {
  const { title } = props
  let { receivedItems, purchaseOrderItems } = props
  const role = useSelector((state) => state.auth.role)
  const receiveTotal =
    receivedItems && receivedItems.length !== 0
      ? receivedItems
          .reduce((acc, b) => acc + Number(b.price) * Number(b.quantity), 0)
          .toLocaleString()
      : 0

  const purchaseTotal =
    purchaseOrderItems && purchaseOrderItems.length !== 0
      ? purchaseOrderItems
          .reduce(
            (acc, b) => acc + Number(b.requestQuantity) * Number(b.unitPrice),
            0,
          )
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

        <h2 className="text-center my-3">{title}</h2>

        <CCardBody className="d-flex justify-content-around">
          <div className="col">
            <div className="d-flex">
              <p className="fw-bolder">Purchase order</p>
            </div>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Designation</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Unit</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Qty</CTableHeaderCell>
                  <CTableHeaderCell scope="col">P.U</CTableHeaderCell>
                  <CTableHeaderCell scope="col">T.P</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {purchaseOrderItems && purchaseOrderItems.length !== 0
                  ? purchaseOrderItems.map((order, i) => (
                      <CTableRow key={i}>
                        <CTableDataCell>{order.name}</CTableDataCell>
                        <CTableDataCell></CTableDataCell>
                        <CTableDataCell>{order.requestQuantity}</CTableDataCell>
                        <CTableDataCell>{order.unitPrice}</CTableDataCell>
                        <CTableDataCell>
                          {Number(order.requestQuantity) *
                            Number(order.unitPrice)}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  : null}
                <CTableRow>
                  <CTableHeaderCell colSpan={4}>Total</CTableHeaderCell>
                  <CTableDataCell>{purchaseTotal}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </div>
          <div className="col">
            <div className="d-flex">
              <p className="fw-bolder">Received </p>
            </div>

            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Designation</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Unit</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Qty</CTableHeaderCell>
                  <CTableHeaderCell scope="col">P.U</CTableHeaderCell>
                  <CTableHeaderCell scope="col">T.P</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {receivedItems && receivedItems.length !== 0
                  ? receivedItems.map((order, i) => (
                      <CTableRow key={i}>
                        <CTableDataCell>{order.itemName}</CTableDataCell>
                        <CTableDataCell></CTableDataCell>
                        <CTableDataCell>{order.quantity}</CTableDataCell>
                        <CTableDataCell>{order.price}</CTableDataCell>
                        <CTableDataCell>
                          {Number(order.quantity) * Number(order.price)}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  : null}
                <CTableRow>
                  <CTableHeaderCell colSpan={3}>Total</CTableHeaderCell>
                  <CTableHeaderCell colSpan={3}>
                    {receiveTotal}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>

        <PrintFooterSignatures />
        <PrintFooterNoSignatures />
      </div>
    </CCard>
  )
})

export default ReceiveVaucherPrint
