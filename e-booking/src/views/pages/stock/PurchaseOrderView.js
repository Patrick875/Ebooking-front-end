import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import PrintTemplate1 from '../Printing/PrintTemplate1'
import PurchaseOrderFooter from '../Printing/PurchaseOrderFooter'
import BackButton from 'src/components/Navigating/BackButton'
import { DataGrid } from '@mui/x-data-grid'

const ViewRequestToCashier = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const request = useSelector((state) => state.selection.selected)
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
  const [rows] = useState(StockPurchaseOrderDetails)
  const columns = [
    {
      headerName: 'Item',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      sortable: false,
      editable: false,
      valueGetter: (params) => `${params.row.StockItemNew?.name || ''} `,
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      sortable: false,
      editable: false,
      hide: (params) => params.rowIndex === rows.length,
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      editable: false,
      hide: true,
      sortable: false,
      valueGetter: (params) => `${params.row.requestQuantity || ''} `,
    },
    {
      field: 'price',
      headerName: 'P.U',
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      editable: false,
      hide: true,
      sortable: false,
      valueGetter: (params) => `${params.row.unitPrice || ''} `,
    },
    {
      field: 'total',
      headerName: 'T.P',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      sortable: false,
      valueGetter: (params) =>
        `${
          Number(params.row.requestQuantity * params.row.unitPrice) ||
          params.row.total
        } `,
    },
  ]
  const total = {
    id: 1000,
    flex: 1,
    minWidth: 200,
    maxWidth: 300,
    StockItemNew: { name: 'Total' },
    requestQuantity: '',
    unitPrice: '',
    total: orderTotal,
  }
  const isLastRow = (params) => params.row.id === total.id
  return (
    <div>
      <div className="d-flex justify-content-between">
        <BackButton />
        <div className="col-md-8 d-flex justify-content-end">
          {StockPurchaseOrderDetails && StockPurchaseOrderDetails !== 0 ? (
            <ReactToPrint
              trigger={() => (
                <button className="btn btn-ghost-primary">Print</button>
              )}
              content={() => ref || componentRef.current}
            />
          ) : null}
        </div>
      </div>

      <PrintTemplate1 ref={ref || componentRef}>
        <div className="m-3 p-3">
          <p className="fw-bold text-center text-uppercase my-1">
            Purchase order &#8470; {request.purchaseOrderId}
          </p>

          <div className="d-flex justify-content-around">
            <div>
              <DataGrid
                rows={[...rows, total]}
                columns={columns}
                hideFooter={true}
                sx={{
                  fontSize: 18,
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
        <PurchaseOrderFooter />
      </PrintTemplate1>
    </div>
  )
})

export default ViewRequestToCashier
