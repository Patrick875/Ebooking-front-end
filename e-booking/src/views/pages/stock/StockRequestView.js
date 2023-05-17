import React, { useState, useRef } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import PrintHeader from '../Printing/PrintHeader'
import PrintFooterNoSignatures from '../Printing/PrintFooterNoSignature'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import BackButton from 'src/components/Navigating/BackButton'

const Request = (props, ref) => {
  const { request, stockOrderDetails } = props
  const orderTotal = request && request.total ? request.total : 0
  return (
    <div className="m-3 p-3">
      <h2 className="text-center my-3">
        Stock order N &#176; {request ? request.stockRequesitionId : null}
      </h2>

      <CCardBody className="d-flex justify-content-around">
        <div className="col">
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Designation</CTableHeaderCell>
                <CTableHeaderCell scope="col">Qty</CTableHeaderCell>
                <CTableHeaderCell scope="col">P.U</CTableHeaderCell>
                <CTableHeaderCell scope="col">T.P</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {stockOrderDetails && stockOrderDetails.length !== 0
                ? stockOrderDetails.map((order, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>
                        {order.StockItemValue.StockItemNew.name}
                      </CTableDataCell>
                      <CTableDataCell>{order.quantity}</CTableDataCell>
                      <CTableDataCell>
                        {order.StockItemValue.price}
                      </CTableDataCell>
                      <CTableDataCell>
                        {Number(
                          Number(order.quantity) *
                            Number(order.StockItemValue.price),
                        ).toLocaleString()}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                : null}
              <CTableRow>
                <CTableHeaderCell colSpan={3}>Total</CTableHeaderCell>
                <CTableHeaderCell>
                  {Number(orderTotal).toLocaleString()}
                </CTableHeaderCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </div>
      </CCardBody>
    </div>
  )
}

const StockRequestView = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const request = useSelector((state) => state.selection.selected)
  const [approved, setApproved] = useState(false)
  let stockOrderDetails
  if (request && request.PetitStockRequesitionDetails) {
    stockOrderDetails = request.PetitStockRequesitionDetails
  }

  const approveStockOrder = async (quantity) => {
    await instance
      .post('petitstock/order/approve', { request: request.id })
      .then(() => {
        toast.success('stock order approved')
        setApproved(!approved)
      })
      .catch(() => {
        toast.error('error approving order')
      })
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
        <BackButton />
        <div className="d-flex justify-content-end">
          {stockOrderDetails && stockOrderDetails.length !== 0 ? (
            <ReactToPrint
              trigger={() => (
                <button className="btn btn-ghost-primary">Print</button>
              )}
              content={() => ref || componentRef.current}
            />
          ) : null}
          <button
            className={`btn btn-ghost-success text-black ${
              request.status === 'APPROVED' || approved ? 'disabled' : null
            }`}
            onClick={() => approveStockOrder()}
          >
            Approve
          </button>
          <button
            className={`btn btn-ghost-danger text-black ${
              request.status === 'APPROVED' || approved ? 'disabled' : null
            }`}
          >
            Cancel
          </button>
        </div>
      </CCardHeader>

      <div style={{ display: 'none' }}>
        <div ref={ref ? ref.current || componentRef : componentRef}>
          <PrintHeader />
          <div className="mx-2">
            <Request request={request} stockOrderDetails={stockOrderDetails} />
          </div>
          <PrintFooterNoSignatures />
        </div>
      </div>

      <Request request={request} stockOrderDetails={stockOrderDetails} />
    </CCard>
  )
})

export default StockRequestView
