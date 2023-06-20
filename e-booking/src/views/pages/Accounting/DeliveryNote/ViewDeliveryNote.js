import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import BackButton from 'src/components/Navigating/BackButton'
import ReactToPrint from 'react-to-print'
import InvoiceHeader from '../../Printing/InvoiceHeader'
import DeliveryFooter from '../../Printing/DeliveryFooter'
import { useNavigate } from 'react-router-dom'
import ClientDetails from '../../Printing/ClientDetails'

const ViewDeliveryNote = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const navigate = useNavigate()
  const request = useSelector((state) => state.selection.selected)
  let DeliveryNoteDetails
  if (request && request.DeliveryNoteDetails) {
    DeliveryNoteDetails = request.DeliveryNoteDetails
  }
  const orderTotal = request && request.total ? request.total : 0
  const [rows] = useState(request.DeliveryNoteDetails)
  const columns = [
    {
      headerName: 'Description',
      field: 'description',
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
      hide: true,
      sortable: false,
    },
    {
      field: 'price',
      headerName: 'P.U',
      width: 200,
      editable: false,
      hide: true,
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
          params.row.total ||
          0
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
        <p className="text-center my-1 text-uppercase">
          Delivery note N &#176; {request.deliveryNoteId}
        </p>
        <ClientDetails
          request={request}
          details={request.DeliveryNoteDetails}
        />
        <div className="m-3 p-3">
          <div className="d-flex justify-content-around">
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
          </div>
        </div>
        <DeliveryFooter />
      </div>
    </div>
  )
})

export default ViewDeliveryNote
