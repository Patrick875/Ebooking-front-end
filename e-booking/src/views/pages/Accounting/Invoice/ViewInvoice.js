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
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import BackButton from 'src/components/Navigating/BackButton'
import PrintFooterNoSignatures from '../../Printing/PrintFooterNoSignature'
import ReactToPrint from 'react-to-print'
import InvoiceHeader from '../../Printing/InvoiceHeader'
import ClientDetails from '../../Printing/ClientDetails'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import InvoicePaymentModal from './InvoicePaymentModal'
import { RiStethoscopeLine } from 'react-icons/ri'

const Item = (props, ref) => {
  const { request, invoiceDetails } = props
  const orderTotal = request && request.total ? request.total : 0
  return (
    <div className="m-3 p-3">
      <h2 className="text-center my-3">
        Invoice N &#176; {request.invoiceGenerated}
      </h2>

      <CCardBody className="d-flex justify-content-around">
        <div className="col">
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                <CTableHeaderCell scope="col">times</CTableHeaderCell>
                <CTableHeaderCell scope="col">P.U</CTableHeaderCell>
                <CTableHeaderCell scope="col">T.P</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {invoiceDetails && invoiceDetails.length !== 0
                ? invoiceDetails.map((el, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>{i + 1}</CTableDataCell>
                      <CTableDataCell>{el.name}</CTableDataCell>
                      <CTableDataCell>{el.quantity}</CTableDataCell>
                      <CTableDataCell>{el.times}</CTableDataCell>
                      <CTableDataCell>{el.price || 1}</CTableDataCell>
                      <CTableDataCell>
                        {Number(
                          el.quantity * el.times * (el.price || 1),
                        ).toLocaleString()}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                : null}
              <CTableRow>
                <CTableHeaderCell />
                <CTableHeaderCell colSpan={4}>Total</CTableHeaderCell>
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

const ViewInvoice = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const request = useSelector((state) => state.selection.selected)
  const [open, setOpen] = useState(false)
  let invoiceDetails
  if (request && request.InvoiceDetails) {
    invoiceDetails = request.InvoiceDetails
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
        <BackButton />
        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-primary"
            disabled={
              Number(
                request.total -
                  request.InvoicePayments.reduce((acc, b) => acc + b.amount, 0),
              ) === 0
                ? true
                : false
            }
            onClick={() => {
              setOpen(true)
            }}
          >
            Add Payment
          </button>

          {invoiceDetails && invoiceDetails.length !== 0 ? (
            <ReactToPrint
              trigger={() => (
                <button className="btn btn-ghost-primary">Print</button>
              )}
              content={() => ref || componentRef.current}
            />
          ) : null}
        </div>
      </CCardHeader>
      <p className="fs-6">
        Payment status :{' '}
        <span className="text-capitalize">
          {request.InvoicePayments && request.InvoicePayments.length !== 0
            ? Number(
                request.InvoicePayments.reduce((acc, b) => acc + b.amount, 0),
              ) +
              ' paid  ' +
              Number(
                request.total -
                  request.InvoicePayments.reduce((acc, b) => acc + b.amount, 0),
              ) +
              ' remaining'
            : request.status}
        </span>{' '}
      </p>
      <div style={{ display: 'none' }}>
        <div ref={ref || componentRef}>
          <InvoiceHeader />
          <ClientDetails details={invoiceDetails} request={request} />
          <Item request={request} invoiceDetails={invoiceDetails} />
          <PrintFooterNoSignatures />
        </div>
      </div>

      <Item request={request} invoiceDetails={invoiceDetails} />
      <InvoicePaymentModal
        maxPayment={Number(
          request.total -
            request.InvoicePayments.reduce((acc, b) => acc + b.amount, 0),
        )}
        invoice={request}
        open={open}
        setOpen={RiStethoscopeLine}
      />
    </CCard>
  )
})

export default ViewInvoice
