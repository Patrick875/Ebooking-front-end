import React, { useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

const AgGridTable = () => {
  const [rowData, setRowData] = useState([
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 },
  ])

  const [columnDefs] = useState([
    {
      headerName: 'Make',
      field: 'make',
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'Model',
      field: 'model',
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'Price',
      field: 'price',
      sortable: true,
      filter: true,
      editable: true,
    },
  ])

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit()
  }

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: '400px', width: '600px' }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        onGridReady={onGridReady}
        suppressCellSelection={true}
        singleClickEdit={true}
        rowSelection="multiple"
        suppressRowClickSelection={true}
      />
    </div>
  )
}

export default AgGridTable
