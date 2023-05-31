import React, { useState, useRef, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import PrintHeader from '../Printing/PrintHeader'
import PrintFooterNoSignatures from '../Printing/PrintFooterNoSignature'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import BackButton from 'src/components/Navigating/BackButton'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const setPrinterFriendly = (api) => {
  const eGridDiv = document.querySelector('#myGrid')
  eGridDiv.style.width = ''
  eGridDiv.style.height = ''
  api.setDomLayout('print')
}

const setNormal = (api) => {
  const eGridDiv = document.querySelector('#myGrid')
  eGridDiv.style.width = '700px'
  eGridDiv.style.height = '200px'
  api.setDomLayout()
}

const Request = (props, ref) => {
  const { request, stockOrderDetails } = props
  const orderTotal = request && request.total ? request.total : 0
  const gridRef = useRef()
  const onBtPrint = useCallback(() => {
    const api = gridRef.current.api
    setPrinterFriendly(api)
    setTimeout(function () {
      window.print()
      setNormal(api)
    }, 2000)
  }, [window.print])
  console.log('stockOrderDetails', stockOrderDetails)
  const [rowData] = useState([...stockOrderDetails])

  const [columnDefs] = useState([
    { field: 'StockItemValue.StockItemNew.name', headerName: 'Designation' },
    { field: 'quantity', headerName: 'Qty', editable: true },
    { field: 'StockItemValue.price', headerName: 'P.U', editable: true },
    { field: 'price', headerName: 'T.P' },
  ])
  return (
    <div className="m-3">
      <CCardBody>
        <button onClick={onBtPrint}>Print</button>

        <h3>Latin Text</h3>

        <p>
          Lorem ipsum dolor sit amet, ne cum repudiare abhorreant. Atqui
          molestiae neglegentur ad nam, mei amet eros ea, populo deleniti
          scaevola et pri. Pro no ubique explicari, his reque nulla consequuntur
          in. His soleat doctus constituam te, sed at alterum repudiandae. Suas
          ludus electram te ius.
        </p>
        <div>
          <div className="ag-theme-alpine" style={{ height: 200, width: 800 }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              animateRows={true}
            ></AgGridReact>

            <h3>More Latin Text</h3>

            <p>
              Lorem ipsum dolor sit amet, ne cum repudiare abhorreant. Atqui
              molestiae neglegentur ad nam, mei amet eros ea, populo deleniti
              scaevola et pri. Pro no ubique explicari, his reque nulla
              consequuntur in. His soleat doctus constituam te, sed at alterum
              repudiandae. Suas ludus electram te ius.
            </p>
          </div>
        </div>
      </CCardBody>
    </div>
  )
}

const EditableStockOrder = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const request = useSelector((state) => state.selection.selected)
  const [approved, setApproved] = useState(false)
  let stockOrderDetails
  if (request && request.PetitStockRequesitionDetails) {
    stockOrderDetails = request.PetitStockRequesitionDetails
  }

  const approveStockOrder = async () => {
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
      <Request request={request} stockOrderDetails={stockOrderDetails} />
    </CCard>
  )
})

export default EditableStockOrder
