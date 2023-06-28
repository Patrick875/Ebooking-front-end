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
import numberToWords from 'number-to-words'

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
  const orderTotal = request && request.total ? request.total : 0
  const amountVAT = Number((orderTotal * VATconstant.value) / 100)
  const total =
    invoiceDetails[0].VAT === 'exclusive'
      ? Number(orderTotal - amountVAT)
      : Number(orderTotal + amountVAT)
  let [rows] = useState(request.InvoiceDetails)
  const columns = [
    {
      headerName: 'Date',
      field: 'date',
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      sortable: false,
      editable: false,
      valueGetter: (params) => {
        if (params.row.date) {
          return new Date(params.row.date).toLocaleDateString()
        } else {
          return ''
        }
      },
    },
    {
      headerName: 'Description',
      field: 'name',
      flex: 1,
      minWidth: 200,
      maxWidth: 250,
      sortable: false,
      editable: false,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      sortable: false,
      editable: false,
      hide: (params) => params.rowIndex === rows.length,
      flex: 1,
      minWidth: 100,
      maxWidth: 120,
    },
    {
      field: 'times',
      headerName: 'times',
      flex: 1,
      minWidth: 100,
      maxWidth: 120,
      editable: false,
      sortable: false,
    },
    {
      field: 'price',
      headerName: 'P.U',
      flex: 1,
      minWidth: 100,
      maxWidth: 120,
      editable: false,
      sortable: false,
    },
    {
      field: 'total',
      headerName: 'T.P',
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      sortable: false,
      valueGetter: (params) =>
        `${
          Number(params.row.quantity * params.row.price * params.row.times) ||
          params.row.total
        } `,
    },
  ]
  const valueRow = {
    id: 3000,
    name: 'VALUE',
    flex: 1,
    minWidth: 200,
    maxWidth: 300,
    requestQuantity: '',
    unitPrice: '',
    total: orderTotal,
  }
  const vatRow = {
    id: 2000,
    name: 'VAT',
    flex: 1,
    minWidth: 200,
    maxWidth: 300,
    requestQuantity: '',
    unitPrice: '',
    total: amountVAT,
  }
  const totalRow = {
    id: 1000,
    name: 'Total',
    flex: 1,
    minWidth: 200,
    maxWidth: 300,
    requestQuantity: '',
    unitPrice: '',
    total: total,
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
        <p className="text-center text-uppercase my-3 fw-bold">
          Invoice N &#176; {request.invoiceGenerated}
        </p>
        <ClientDetails details={invoiceDetails} request={request} />
        <div className="my-1 py-1">
          <div className="d-flex justify-content-around my-0 py-0">
            <div className="col ">
              <DataGrid
                rows={[...rows, valueRow, vatRow, totalRow]}
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
                    display: params.row.id === 1000 ? 'none' : 'flex',
                  },
                })}
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
