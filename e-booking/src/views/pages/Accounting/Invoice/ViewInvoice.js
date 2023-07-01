import { CCardHeader } from '@coreui/react'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

import BackButton from 'src/components/Navigating/BackButton'
import ReactToPrint from 'react-to-print'
import InvoiceHeader from '../../Printing/InvoiceHeader'
import ClientDetails from '../../Printing/ClientDetails'
import InvoicePaymentModal from './InvoicePaymentModal'
import { RiStethoscopeLine } from 'react-icons/ri'
import InvoiceFooter from '../../Printing/InvoiceFooter'
import numberToWords from 'number-to-words'
import EditableTable from 'src/components/EditableTable'

const ViewInvoice = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const request = useSelector((state) => state.selection.selected)
  const [open, setOpen] = useState(false)
  let invoiceDetails
  if (request && request.InvoiceDetails) {
    invoiceDetails = request.InvoiceDetails
  }
  const VATconstant = useSelector((state) =>
    state.constants.constants.filter((constant) => constant.name === 'VAT'),
  )[0] || { value: 0, name: 'VAT' }
  const initialRows = [
    {
      id: uuidv4(),
      name: '',
      quantity: '',
      times: '',
      price: '',
    },
    {
      id: uuidv4(),
      name: '',
      quantity: '',
      times: '',
      price: '',
    },
    {
      id: uuidv4(),
      name: '',
      quantity: '',
      times: '',
      price: '',
    },
    {
      id: uuidv4(),
      name: '',
      quantity: '',
      times: '',
      price: '',
    },
  ]
  const orderTotal = request && request.total ? request.total : 0
  const amountVAT = Number((orderTotal * VATconstant.value) / 100)
  const total =
    invoiceDetails[0].VAT === 'exclusive'
      ? Number(orderTotal + amountVAT)
      : Number(orderTotal - amountVAT)

  return (
    <div>
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
      {request.deliveryLink ? (
        <p className="fs-6">Linked to deliver note n: {request.deliveryLink}</p>
      ) : null}

      <div ref={ref || componentRef} className="accounting">
        <InvoiceHeader />
        <p className="text-center text-uppercase my-3 fw-bold">
          Invoice N &#176; {request.invoiceGenerated}
        </p>
        <ClientDetails details={invoiceDetails} request={request} />
        <div className="my-1 py-1">
          <div className="d-flex justify-content-around my-0 py-0">
            <div className="col ">
              <EditableTable
                data={[...invoiceDetails, ...initialRows]}
                readOnly={true}
              />
            </div>
          </div>
          <p className="text-capitalize">
            <span className="fw-bold"> Total in words :</span>
            {total ? numberToWords.toWords(total) : null}
            {request.currency !== 'USD' ? ' Rwandan Francs ' : ' US Dollars '}
          </p>
        </div>
        <InvoiceFooter />
      </div>
      <InvoicePaymentModal
        maxPayment={Number(
          request.total -
            request.InvoicePayments.reduce((acc, b) => acc + b.amount, 0),
        )}
        invoice={request}
        open={open}
        setOpen={RiStethoscopeLine}
      />
    </div>
  )
})

export default ViewInvoice
