import { CImage, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import logo from '../../../assets/images/olympic_hotel_logo.png'
import PrintFooterSignatures from './PrintFooterSignatures'
import PrintFooterNoSignatures from './PrintFooterNoSignature'
import { DataGrid } from '@mui/x-data-grid'

const ReceiveVaucherPrint = React.forwardRef((props, ref) => {
  const { title } = props
  let [rowsPurchase] = useState(props.purchaseOrderItems)
  let [rowsReceive, setRowsReceive] = useState(props.purchaseOrderItems)
  const totalPurchases =
    rowsPurchase && rowsPurchase.length !== 0
      ? rowsPurchase.reduce((a, b) => a + b.unitPrice * b.requestQuantity, 0)
      : 0
  const totalReceiving =
    rowsReceive && rowsReceive.length !== 0
      ? rowsReceive.reduce((a, b) => a + b.unitPrice * b.requestQuantity, 0)
      : 0
  const Balance = totalPurchases - totalReceiving
  const columnsPurchase = [
    {
      headerName: 'Item',
      flex: 1,
      minWidth: 140,
      maxWidth: 200,
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
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
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
      minWidth: 100,
      maxWidth: 200,
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
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      sortable: false,
      valueGetter: (params) => `${params.row.StockItemNew?.name || ''} `,
    },
    {
      field: 'unit',
      headerName: 'Unit',
      sortable: false,
      hide: (params) => params.rowIndex === rowsReceive.length,
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      valueSetter: (params) => {
        const updateRow = {
          ...params.row,
          unitPrice: params.value,
        }
        let newRows = rowsReceive.map((item) =>
          item.id === params.row.id
            ? { ...params.row, unit: params.value }
            : item,
        )
        setRowsReceive(newRows)
        return updateRow
      },
      editable: true,
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      editable: true,
      hide: (params) => params.rowIndex === rowsReceive.length,
      sortable: false,
      valueGetter: (params) => `${params.row.requestQuantity || ''} `,
      valueSetter: (params) => {
        const updatedRow = {
          ...params.row,
          requestQuantity: params.value,
        }
        let newRows = rowsReceive.map((item) =>
          item.id === params.row.id
            ? {
                ...params.row,
                requestQuantity: Number(params.value),
              }
            : item,
        )
        setRowsReceive(newRows)
        return updatedRow
      },
    },
    {
      field: 'price',
      headerName: 'P.U',
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      editable: true,
      hide: true,
      sortable: false,
      valueGetter: (params) => `${params.row.unitPrice || ''} `,
      valueSetter: (params) => {
        console.log('row', params.row)
        const updatedRow = {
          ...params.row,
          unitPrice: params.value,
        }
        let newRows = rowsReceive.map((item) =>
          item.id === params.row.id
            ? {
                ...params.row,
                unitPrice: Number(params.value),
              }
            : item,
        )
        setRowsReceive(newRows)
        return updatedRow
      },
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
          Number(params.row.requestQuantity * params.row.unitPrice) ||
          params.row.total
        } `,
    },
  ]
  const totalPurchase = {
    StockItemNew: { name: 'Total' },
    id: 1000,
    name: 'Total',
    requestQuantity: '',
    unitPrice: '',
    total: totalPurchases,
  }
  const balancePurchase = {
    StockItemNew: { name: 'Balance' },
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
    total: totalReceiving,
  }
  const isLastRowReceive = (params) => params.row.id === totalReceive.id
  const balanceReceive = {
    id: 2000,
    StockItemNew: { name: '' },
    requestQuantity: '',
    unitPrice: '',
    total: Balance,
  }

  useEffect(() => {
    props.setData(rowsReceive)
  }, [rowsReceive])

  return (
    <div ref={ref}>
      <div className="m-3 p-3">
        <div className="d-flex flex-col my-3">
          <p className="col">
            Done on{' '}
            {new Date().toLocaleDateString() +
              ' at  ' +
              new Date().toLocaleTimeString()}
          </p>
          <p className="col">eBooking</p>
        </div>

        <CRow className="col d-flex flex-row">
          <div className="col-4">
            <CImage src={logo} fluid alt="olympic hotel logo" />
          </div>
          <div className="col">
            <p className="text-uppercase my-0 py-0">OLYMPIC HOTEL</p>
            <p className="my-0 py-0">TEL: +250 789 677 479/ +250 783 103 500</p>
            <p className="my-0 py-0">E-mail:info@olympichotel.rw</p>
            <p className="my-0 py-0">Website: www.olympichotel.rw</p>
            <p className="my-0 py-0">TIN/VAT: 102556009</p>
          </div>
        </CRow>
        <h5 className="text-center my-1 py-0 text-uppercase">{title}</h5>
        <div className="d-flex justify-content-around">
          <div className="col">
            <div>
              <p className="fw-bolder">Purchase order</p>
              {props.purchaseOrderItems &&
              props.purchaseOrderItems.length !== 0 ? (
                <DataGrid
                  rows={[...rowsPurchase, totalPurchase, balancePurchase]}
                  columns={columnsPurchase}
                  hideFooter={true}
                  sx={{
                    fontSize: 24,
                    '& .MuiDataGrid-cell': {
                      border: '2px solid black ',
                    },
                    '& .MuiDataGrid-columnHeader': {
                      border: '2px solid black ',
                    },
                  }}
                  getColumnProps={(params) => ({
                    style: {
                      display: isLastRowPurchase(params) ? 'none' : 'flex',
                    },
                  })}
                />
              ) : null}
            </div>
          </div>
          <div className="col">
            <div>
              <p className="fw-bolder">Received </p>
              {props.purchaseOrderItems &&
              props.purchaseOrderItems.length !== 0 ? (
                <DataGrid
                  rows={[...rowsReceive, totalReceive, balanceReceive]}
                  columns={columnsReceive}
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
                      display: isLastRowReceive(params) ? 'none' : 'flex',
                    },
                  })}
                />
              ) : null}
            </div>
          </div>
        </div>

        <PrintFooterSignatures />
        <PrintFooterNoSignatures />
      </div>
    </div>
  )
})

export default ReceiveVaucherPrint
