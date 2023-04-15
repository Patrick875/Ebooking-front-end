import {
  CCard,
  CCardBody,
  CCardHeader,
  CImage,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import PrintTemplate1 from '../Printing/PrintTemplate1'

const Request = (props, ref) => {
  const { request, orderTotal, StockPurchaseOrderDetails } = props
  return (
    <div className="m-3 p-3">
      <h2 className="text-center my-3">
        Purchase order of{' '}
        {request && request.date
          ? new Date(request.date).toLocaleDateString()
          : null}
      </h2>

      <CCardBody className="d-flex justify-content-around">
        <div className="col">
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
              {StockPurchaseOrderDetails &&
              StockPurchaseOrderDetails.length !== 0
                ? StockPurchaseOrderDetails.map((order, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>{order.StockItem.name}</CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell>{order.requestQuantity}</CTableDataCell>
                      <CTableDataCell>{order.unitPrice}</CTableDataCell>
                      <CTableDataCell>
                        {Number(
                          Number(order.requestQuantity) *
                            Number(order.unitPrice),
                        ).toLocaleString()}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                : null}
              <CTableRow>
                <CTableHeaderCell colSpan={4}>Total</CTableHeaderCell>
                <CTableHeaderCell>{orderTotal}</CTableHeaderCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </div>
      </CCardBody>
    </div>
  )
}

const ViewRequestToCashier = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const { title } = props
  let { receivedItems, purchaseOrderItems } = props
  const request = useSelector((state) => state.selection.selected)
  const role = useSelector((state) => state.auth.role)
  let StockPurchaseOrderDetails
  if (request && request.StockPurchaseOrderDetails) {
    StockPurchaseOrderDetails = request.StockPurchaseOrderDetails
  }
  const orderTotal =
    StockPurchaseOrderDetails && StockPurchaseOrderDetails !== 0
      ? StockPurchaseOrderDetails.reduce(
          (acc, b) => acc + Number(b.requestQuantity) * Number(b.unitPrice),
          0,
        ).toLocaleString()
      : 0
  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-end">
        {StockPurchaseOrderDetails && StockPurchaseOrderDetails !== 0 ? (
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-ghost-primary">Print</button>
            )}
            content={() => ref || componentRef.current}
          />
        ) : null}
        <button className="btn btn-ghost-success text-black">Approve</button>
        <button className="btn btn-ghost-warning text-black">
          Request revision
        </button>
        <button className="btn btn-ghost-danger text-black">Cancel</button>
      </CCardHeader>
      <div style={{ display: 'none' }}>
        <PrintTemplate1 ref={ref || componentRef}>
          <Request
            request={request}
            orderTotal={orderTotal}
            StockPurchaseOrderDetails={StockPurchaseOrderDetails}
          />
        </PrintTemplate1>
      </div>
      <Request
        request={request}
        orderTotal={orderTotal}
        StockPurchaseOrderDetails={StockPurchaseOrderDetails}
      />
    </CCard>
  )
})

export default ViewRequestToCashier

//table 1

//  <CTableBody>
//                 {request.StockPurchaseOrder.StockPurchaseOrderDetails !== 0
//                   ? request.StockPurchaseOrder['StockPurchaseOrderDetails'].map(
//                       (order, i) => (
//                         <CTableRow key={i}>
//                           <CTableDataCell>
//                             {order.StockItem.name}
//                           </CTableDataCell>
//                           <CTableDataCell></CTableDataCell>
//                           <CTableDataCell>
//                             {order.requestQuantity}
//                           </CTableDataCell>
//                           <CTableDataCell>{order.unitPrice}</CTableDataCell>
//                           <CTableDataCell>
//                             {Number(order.requestQuantity) *
//                               Number(order.unitPrice)}
//                           </CTableDataCell>
//                         </CTableRow>
//                       ),
//                     )
//                   : null}

//                 <CTableRow>
//                   <CTableHeaderCell colSpan={4}>Total</CTableHeaderCell>
//                   <CTableDataCell>{purchaseTotal}</CTableDataCell>
//                 </CTableRow>
//               </CTableBody>

//table 2
