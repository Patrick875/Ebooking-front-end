import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import PrintHeader from '../Printing/PrintHeader'
import PrintFooterNoSignatures from '../Printing/PrintFooterNoSignature'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import BackButton from 'src/components/Navigating/BackButton'
import { DataGrid } from '@mui/x-data-grid'

const StockRequestView = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  let [stockOrderDetails] = useState([])
  const request = useSelector((state) => state.selection.selected)
  if (request && request.PetitStockRequesitionDetails) {
    stockOrderDetails = request.PetitStockRequesitionDetails
  }
  const [approved, setApproved] = useState(false)
  let [rows, setRows] = useState(stockOrderDetails)
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 220,
      sortable: false,
      valueGetter: (params) =>
        `${params.row.StockItemValue.StockItemNew.name || ''} `,
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      sortable: false,
      hide: (params) => params.rowIndex === stockOrderDetails.length,
      width: 220,
      valueSetter: (params) => {
        const updateRow = {
          ...params.row,
          quantity: params.value,
        }
        let newRows = rows.map((item) =>
          item.StockItemValue.id === params.row.StockItemValue.id
            ? { ...params.row, quantity: Number(params.value) }
            : item,
        )
        setRows(newRows)
        return updateRow
      },
      editable: true,
    },
    {
      field: 'price',
      headerName: 'P.U',
      width: 220,
      editable: true,
      hide: true,
      sortable: false,
      valueGetter: (params) => `${params.row.StockItemValue.price || ''} `,
      valueSetter: (params) => {
        const updatedRow = {
          ...params.row,
          StockItemValue: {
            ...params.row.StockItemValue,
            price: params.value,
          },
        }
        let newRows = rows.map((item) =>
          item.StockItemValue.id === params.row.StockItemValue.id
            ? {
                ...params.row,
                StockItemValue: {
                  ...params.row.StockItemValue,
                  price: Number(params.value),
                },
              }
            : item,
        )
        setRows(newRows)
        return updatedRow
      },
    },
    {
      field: 'total',
      headerName: 'T.P',
      width: 300,
      sortable: false,
      valueGetter: (params) =>
        `${
          Number(params.row.quantity * params.row.StockItemValue.price) ||
          params.row.total
        } `,
    },
  ]
  const isLastRow = (params) => params.row.id === total.id
  const total = {
    id: 1000,
    quantity: '',
    total: rows.reduce((a, b) => a + b.StockItemValue.price * b.quantity, 0),
    StockItemValue: {
      id: 214,
      quantity: '',
      price: '',
      StockItemNew: {
        id: 494,
        name: 'Total',
      },
    },
  }

  const updateStockOrder = async (action) => {
    if (action === 'approve') {
      await instance
        .post('petitstock/order/approve', {
          request: request.id,
          data: rows,
        })
        .then(() => {
          toast.success('stock order approved')
          setApproved(!approved)
        })
        .catch(() => {
          toast.error('error approving order')
        })
    } else if (action === 'cancel') {
      await instance
        .post('petitstock/order/cancel', {
          request: request.id,
        })
        .then(() => {
          toast.success('stock order canceled')
          setApproved(!approved)
        })
        .catch(() => {
          toast.error('error approving order')
        })
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between">
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
              request.status === 'APPROVED' || request.status === 'CANCELED'
                ? 'disabled'
                : null
            }`}
            onClick={() => updateStockOrder('approve')}
          >
            Approve
          </button>
          <button
            className={`btn btn-ghost-danger text-black ${
              request.status === 'APPROVED' || request.status === 'CANCELED'
                ? 'disabled'
                : null
            }`}
            onClick={() => updateStockOrder('cancel')}
          >
            Cancel
          </button>
        </div>
      </div>

      <div>
        <div ref={ref || componentRef}>
          <PrintHeader />
          <div className="m-3 p-3">
            <h5 className="text-center my-1 text-uppercase">
              Stock order N &#176; {request ? request.stockRequesitionId : null}
            </h5>

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
          <PrintFooterNoSignatures />
        </div>
      </div>
    </div>
  )
})

export default StockRequestView
