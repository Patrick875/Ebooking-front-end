import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import BackButton from 'src/components/Navigating/BackButton'
import ReactToPrint from 'react-to-print'
import InvoiceHeader from '../../Printing/InvoiceHeader'
import DeliveryFooter from '../../Printing/DeliveryFooter'
import { useNavigate } from 'react-router-dom'
import ClientDetails from '../../Printing/ClientDetails'
import EditableTable from 'src/components/EditableTable'
import { initialRows } from 'src/utils/constants'

const ViewDeliveryNote = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const navigate = useNavigate()
  const request = useSelector((state) => state.selection.selected)
  console.log('requets', request)
  let DeliveryNoteDetails
  if (request && request.DeliveryNoteDetails) {
    DeliveryNoteDetails = request.DeliveryNoteDetails
  }
  const orderTotal = request && request.total ? request.total : 0
  const [rows, setRows] = useState([
    ...request.DeliveryNoteDetails,
    ...initialRows,
  ])
  const total = {
    id: 1000,
    description: 'Total',
    width: 200,
    flex: 1,
    minWidth: 200,
    maxWidth: 300,
    requestQuantity: '',
    unitPrice: '',
    total: orderTotal,
  }

  return (
    <div>
      <div className="d-flex justify-content-between">
        <BackButton />
        <button
          className="btn btn-ghost-primary"
          onClick={() => {
            navigate('/booking/accounting/delivery/transfer')
          }}
        >
          Transfer to invoice
        </button>
        <div className="d-flex justify-content-end">
          {DeliveryNoteDetails && DeliveryNoteDetails.length !== 0 ? (
            <ReactToPrint
              trigger={() => (
                <button className="btn btn-ghost-primary">Print</button>
              )}
              content={() => ref || componentRef.current}
            />
          ) : null}
        </div>
      </div>
      <div ref={ref || componentRef}>
        <InvoiceHeader title="Delivery note" />
        <p className="text-center my-1 text-uppercase fw-bold">
          Delivery note N &#176; {request.deliveryNoteId}
        </p>
        <ClientDetails
          request={request}
          details={request.DeliveryNoteDetails}
        />
        <div className="my-3 py-3">
          <div className="d-flex justify-content-around">
            <div className="col">
              <EditableTable data={rows} setRows={setRows} readOnly={true} />
            </div>
          </div>
        </div>
        <DeliveryFooter />
      </div>
    </div>
  )
})

export default ViewDeliveryNote
