import React, { useState, useMemo, useRef } from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { useSelector } from 'react-redux'
import { AgGridReact } from 'ag-grid-react'
import ReactToPrint from 'react-to-print'
import PrintHeader from '../Printing/PrintHeader'
import PrintFooterNoSignatures from '../Printing/PrintFooterNoSignature'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import BackButton from 'src/components/Navigating/BackButton'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const Request = (props, ref) => {
  const containerStyle = { width: '100%', height: '100%' }
  const gridStyle = { height: 500, width: '100%' }
  const request = useSelector((state) => state.selection.selected)
  let stockOrderDetails
  if (request && request.PetitStockRequesitionDetails) {
    stockOrderDetails = request.PetitStockRequesitionDetails

    stockOrderDetails =
      stockOrderDetails.length !== 0
        ? stockOrderDetails.map((el) => {
            return {
              ...el,
              total: Number(el.quantity * el.StockItemValue.price),
            }
          })
        : stockOrderDetails
  }
  const totalRequestGetter = () => {
    if (stockOrderDetails && stockOrderDetails.length !== 0) {
      return stockOrderDetails.reduce(
        (acc, el) => acc + Number(el.quantity * el.StockItemValue.price),
        0,
      )
    }
    return 0
  }
  const totalGetter = (params) => {
    const stockItemValue = params.data?.StockItemValue
    const quantity = params.data?.quantity

    if (stockItemValue && stockItemValue.price && quantity) {
      return Number(stockItemValue.price * quantity).toLocaleString()
    } else {
      return totalRequestGetter().toLocaleString()
    }
  }
  const totalRow = {
    StockItemValue: { StockItemNew: { name: 'Total' } },
    quantity: '',
    'StockItemValue.price': '',
    totalPrice: totalRequestGetter,
  }
  const [rowData, setRowData] = useState([...stockOrderDetails, totalRow])

  const columnDefs = useMemo(
    () => [
      {
        field: 'StockItemValue.StockItemNew.name',
        headerName: 'Designation',
        editable: false,
      },
      {
        field: 'quantity',
        headerName: 'Qty',
        editable: true,
      },
      { field: 'StockItemValue.price', headerName: 'P.U', editable: true },
      {
        headerName: 'T.P',
        field: 'totalPrice',
        valueGetter: totalGetter,
      },
    ],
    [],
  )
  const gridApiRef = useRef(null)

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit()
    gridApiRef.current = params.api // Save reference to the grid API
  }

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
    }
  }, [])

  return (
    <div className="card">
      <div className="m-3 p-3">
        <h2 className="text-center my-3">
          Stock order N &#176; {request ? request.stockRequesitionId : null}
        </h2>
      </div>
      <div style={containerStyle}>
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            rowData={rowData}
            onGridReady={onGridReady}
            onFirstDataRendered={() => {
              if (gridApiRef.current) {
                gridApiRef.current.sizeColumnsToFit()
              }
            }}
            animateRows={true}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
          ></AgGridReact>
        </div>
      </div>
    </div>
  )
}

const StockRequestView = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const request = useSelector((state) => state.selection.selected)
  const [approved, setApproved] = useState(false)
  let stockOrderDetails
  if (request && request.PetitStockRequesitionDetails) {
    stockOrderDetails = request.PetitStockRequesitionDetails
  }

  const approveStockOrder = async (quantity) => {
    await instance
      .post('petitstock/order/approve', { request: request.id })
      .then(() => {
        toast.success('stock order approved')
        setApproved(!approved)
      })
      .catch(() => {
        toast.error('error approving order')
      })
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
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
              request.status === 'APPROVED' || approved ? 'disabled' : null
            }`}
            onClick={() => approveStockOrder()}
          >
            Approve
          </button>
          <button
            className={`btn btn-ghost-danger text-black ${
              request.status === 'APPROVED' || approved ? 'disabled' : null
            }`}
          >
            Cancel
          </button>
        </div>
      </CCardHeader>

      <div style={{ display: 'none' }}>
        <div ref={ref ? ref.current || componentRef : componentRef}>
          <PrintHeader />
          <div className="mx-2">
            <Request request={request} stockOrderDetails={stockOrderDetails} />
          </div>
          <PrintFooterNoSignatures />
        </div>
      </div>

      <Request request={request} stockOrderDetails={stockOrderDetails} />
    </CCard>
  )
})

export default StockRequestView
