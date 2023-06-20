import { CCardBody, CCardHeader } from '@coreui/react'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import BackButton from 'src/components/Navigating/BackButton'
import ReactToPrint from 'react-to-print'
import InvoiceHeader from '../../Printing/InvoiceHeader'
import ClientDetails from '../../Printing/ClientDetails'
import InvoicePaymentModal from './InvoicePaymentModal'
import { RiStethoscopeLine } from 'react-icons/ri'
import InvoiceFooter from '../../Printing/InvoiceFooter'

const ViewInvoice = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const request = useSelector((state) => state.selection.selected)
  const [open, setOpen] = useState(false)
  let invoiceDetails
  if (request && request.InvoiceDetails) {
    invoiceDetails = request.InvoiceDetails
  }

  const orderTotal = request && request.total ? request.total : 0
  const [rows] = useState(request.InvoiceDetails)
  const columns = [
    {
      headerName: 'Description',
      field: 'name',
      width: 200,
      sortable: false,
      editable: false,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      sortable: false,
      editable: false,
      hide: (params) => params.rowIndex === rows.length,
      width: 200,
    },
    {
      field: 'times',
      headerName: 'times',
      width: 200,
      editable: false,
      sortable: false,
    },
    {
      field: 'price',
      headerName: 'P.U',
      width: 200,
      editable: false,
      sortable: false,
    },
    {
      field: 'total',
      headerName: 'T.P',
      width: 200,
      sortable: false,
      valueGetter: (params) =>
        `${
          Number(params.row.quantity * params.row.price * params.row.times) ||
          params.row.total
        } `,
    },
  ]
  const total = {
    id: 1000,
    name: 'Total',
    width: 200,
    requestQuantity: '',
    unitPrice: '',
    total: orderTotal,
  }
  const isLastRow = (params) => params.row.id === total.id

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

      <div ref={ref || componentRef}>
        <InvoiceHeader />
        <ClientDetails details={invoiceDetails} request={request} />
        <div className="my-1 py-1">
          <p className="text-center text-uppercase my-3">
            Invoice N &#176; {request.invoiceGenerated}
          </p>

          <CCardBody className="d-flex justify-content-around">
            <div className="col">
              <DataGrid
                rows={[...rows, total]}
                columns={columns}
                hideFooter={true}
                sx={{
                  '& .MuiDataGrid-cell': {
                    border: '2px solid black ',
                  },
                  '& .MuiDataGrid-columnHeader': {
                    border: '2px solid black ',
                  },
                }}
                getColumnProps={(params) => ({
                  style: {
                    display: isLastRow(params) ? 'none' : 'flex',
                  },
                })}
              />
            </div>
          </CCardBody>
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
