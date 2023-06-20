import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import PrintTemplate1 from '../Printing/PrintTemplate1'
import PurchaseOrderFooter from '../Printing/PurchaseOrderFooter'
import BackButton from 'src/components/Navigating/BackButton'
import { DataGrid } from '@mui/x-data-grid'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

const ViewRequestToCashier = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const [approved, setApproved] = useState(false)
  const request = useSelector((state) => state.selection.selected)
  let StockPurchaseOrderDetails
  if (request && request.StockPurchaseOrderDetails) {
    StockPurchaseOrderDetails = request.StockPurchaseOrderDetails
  }
  let [rows, setRows] = useState(StockPurchaseOrderDetails)
  const approvePurchaseOrder = async () => {
    await instance
      .post('/purchase/order/approve', { orderId: request.id, data: [...rows] })
      .then((res) => {
        toast.success('purchase order approved !!')
        setApproved(!approved)
        console.log(res.data.data)
      })
      .catch(() => {
        toast.error('purchase order approval failed !!!')
      })
  }

  const columns = [
    {
      field: 'Designation',
      headerName: 'Designation',
      width: 200,
      sortable: false,
      valueGetter: (params) => `${params.row.StockItemNew.name || ''} `,
    },
    {
      field: 'unit',
      headerName: 'Unit',
      sortable: false,
      hide: (params) => params.rowIndex === StockPurchaseOrderDetails.length,
      width: 200,
      valueSetter: (params) => {
        const updateRow = {
          ...params.row,
          unit: params.value,
        }
        let newRows = rows.map((item) =>
          item.id === params.row.id
            ? { ...params.row, unit: params.value }
            : item,
        )
        setRows(newRows)
        return updateRow
      },
      editable: true,
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      width: 200,
      editable: true,
      hide: true,
      sortable: false,
      valueGetter: (params) => `${params.row.requestQuantity || ''} `,
      valueSetter: (params) => {
        const updatedRow = {
          ...params.row,
          requestQuantity: params.value,
        }
        let newRows = rows.map((item) =>
          item.id === params.row.id
            ? {
                ...params.row,
                requestQuantity: Number(params.value),
              }
            : item,
        )
        setRows(newRows)
        return updatedRow
      },
    },
    {
      field: 'price',
      headerName: 'P.U',
      width: 200,
      editable: true,
      hide: true,
      sortable: false,
      valueGetter: (params) => `${params.row.unitPrice || ''} `,
      valueSetter: (params) => {
        const updatedRow = {
          ...params.row,
          unitPrice: params.value,
        }
        let newRows = rows.map((item) =>
          item.id === params.row.id
            ? {
                ...params.row,
                unitPrice: Number(params.value),
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
      width: 230,
      sortable: false,
      valueGetter: (params) =>
        `${
          Number(params.row.requestQuantity * params.row.unitPrice) ||
          params.row.total
        } `,
    },
  ]
  const isLastRow = (params) => params.row.id === total.id
  const total = {
    id: 1000,
    StockItemNew: { name: 'Total' },
    requestQuantity: '',
    unit: '',
    unitPrice: '',
    total: rows.reduce((a, b) => a + b.unitPrice * b.requestQuantity, 0),
  }

  return (
    <div className="mx-0 px-0">
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
          <button
            className="btn btn-ghost-success text-black"
            onClick={approvePurchaseOrder}
            disabled={request.status === 'APPROVED' || approved}
          >
            Approve
          </button>

          <button
            className="btn btn-ghost-danger text-black"
            disabled={request.status === 'APPROVED' || approved}
          >
            Cancel
          </button>
        </div>
      </div>
      <PrintTemplate1 ref={ref || componentRef}>
        <div className="mx-0 my-0  py-0 px-0 ">
          <h5 className="text-center my-1 text-uppercase">
            Purchase order &#8470; {request.purchaseOrderId}
          </h5>
          <div
            style={{
              overflowX: 'hidden',
              margin: 0,
              padding: 0,
              dispaly: 'flex',
              justifyContent: 'center',
            }}
          >
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
        <PurchaseOrderFooter />
      </PrintTemplate1>
    </div>
  )
})

export default ViewRequestToCashier
