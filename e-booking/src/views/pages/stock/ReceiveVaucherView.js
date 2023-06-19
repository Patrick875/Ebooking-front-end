import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import PrintHeader from '../Printing/PrintHeader'
import PrintFooterSignatures from '../Printing/PrintFooterSignatures'
import PrintFooterNoSignatures from '../Printing/PrintFooterNoSignature'
import BackButton from 'src/components/Navigating/BackButton'
import { DataGrid } from '@mui/x-data-grid'

const ReceiveVaucherView = React.forwardRef((props, ref) => {
  const vaucher = useSelector((state) => state.selection.selected)
  const componentRef = useRef()
  let [rowsPurchase] = useState(
    vaucher.StockPurchaseOrder.StockPurchaseOrderDetails,
  )
  let [rowsReceive] = useState(vaucher.StockReceiveVoucherDetails)
  const receiveTotal =
    vaucher && vaucher.StockReceiveVoucherDetails !== 0
      ? vaucher.StockReceiveVoucherDetails.reduce(
          (acc, b) => acc + Number(b.receivedQuantity) * Number(b.unitPrice),
          0,
        )
      : 0

  const purchaseTotal =
    vaucher &&
    vaucher.StockPurchaseOrder &&
    vaucher.StockPurchaseOrder.StockPurchaseOrderDetails !== 0
      ? vaucher.StockPurchaseOrder['StockPurchaseOrderDetails'].reduce(
          (acc, b) => acc + Number(b.requestQuantity) * Number(b.unitPrice),
          0,
        )
      : 0
  const Balance = purchaseTotal - receiveTotal
  const columnsPurchase = [
    {
      headerName: 'Item',
      width: 120,
      sortable: false,
      editable: false,
      valueGetter: (params) => `${params.row.StockItemNew?.name || ''} `,
    },
    {
      field: 'unit',
      headerName: 'Unit',
      sortable: false,
      editable: false,
      hide: (params) => params.rowIndex === rowsPurchase.length,
      width: 120,
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      width: 120,
      editable: false,
      hide: true,
      sortable: false,
      valueGetter: (params) => `${params.row.requestQuantity || ''} `,
    },
    {
      field: 'price',
      headerName: 'P.U',
      width: 120,
      editable: false,
      hide: true,
      sortable: false,
      valueGetter: (params) => `${params.row.unitPrice || ''} `,
    },
    {
      field: 'total',
      headerName: 'T.P',
      width: 120,
      sortable: false,
      valueGetter: (params) =>
        `${
          Number(params.row.requestQuantity * params.row.unitPrice) ||
          params.row.total
        } `,
    },
  ]
  const columnsReceive = [
    {
      field: 'name',
      headerName: 'Item',
      width: 120,
      sortable: false,
      editable: false,
      valueGetter: (params) => `${params.row.StockItemNew?.name || ''} `,
    },
    {
      field: 'unit',
      headerName: 'Unit',
      sortable: false,
      editable: false,
      hide: (params) => params.rowIndex === rowsReceive.length,
      width: 120,
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      width: 120,
      editable: false,
      hide: (params) => params.rowIndex === rowsReceive.length,
      sortable: false,
      valueGetter: (params) => `${params.row.receivedQuantity || ''} `,
    },
    {
      field: 'price',
      headerName: 'P.U',
      width: 120,
      editable: false,
      hide: true,
      sortable: false,
      valueGetter: (params) => `${params.row.unitPrice || ''} `,
    },
    {
      field: 'total',
      headerName: 'T.P',
      width: 120,
      sortable: false,
      editable: false,
      valueGetter: (params) =>
        `${
          Number(params.row.receivedQuantity * params.row.unitPrice) ||
          params.row.total
        } `,
    },
  ]
  const totalPurchase = {
    id: 1000,
    name: 'Total',
    requestQuantity: '',
    unitPrice: '',
    total: purchaseTotal,
  }
  const balancePurchase = {
    id: 2000,
    name: 'Balance',
    requestQuantity: '',
    unitPrice: '',
    total: '',
  }

  const isLastRowPurchase = (params) => params.row.id === totalPurchase.id
  const totalReceive = {
    id: 1000,
    name: 'Total',
    requestQuantity: '',
    unitPrice: '',
    total: receiveTotal,
  }
  const isLastRowReceive = (params) => params.row.id === totalReceive.id
  const balanceReceive = {
    id: 2000,
    StockItemNew: { name: '' },
    requestQuantity: '',
    unitPrice: '',
    total: Balance,
  }

  return (
    <div>
      <div className="d-flex justify-content-between">
        <BackButton />
        <ReactToPrint
          trigger={() => (
            <button className="btn btn-ghost-primary">Print</button>
          )}
          content={() => ref || componentRef.current}
        />
      </div>

      <div ref={ref || componentRef}>
        <PrintHeader />
        <div className="m-3 p-3">
          <p className="text-center text-uppercase my-1">
            Receive stock vaucher of{' '}
            {vaucher && vaucher.date
              ? new Date(vaucher.date).toLocaleDateString()
              : null}
          </p>

          <div className="d-flex justify-content-around">
            <div className="col">
              <div className="d-flex">
                <p className="fw-normal">Purchase order</p>
              </div>
              <DataGrid
                rows={[...rowsPurchase, totalPurchase, balancePurchase]}
                columns={columnsPurchase}
                hideFooter={true}
                getColumnProps={(params) => ({
                  style: {
                    display: isLastRowPurchase(params) ? 'none' : 'flex',
                  },
                })}
              />
            </div>
            <div className="col">
              <div className="d-flex">
                <p className="fw-normal">Received </p>
              </div>
              <DataGrid
                rows={[...rowsReceive, totalReceive, balanceReceive]}
                columns={columnsReceive}
                hideFooter={true}
                getColumnProps={(params) => ({
                  style: {
                    display: isLastRowReceive(params) ? 'none' : 'flex',
                  },
                })}
              />
            </div>
          </div>
        </div>
        <PrintFooterSignatures />
        <PrintFooterNoSignatures />
      </div>
    </div>
  )
})

export default ReceiveVaucherView
