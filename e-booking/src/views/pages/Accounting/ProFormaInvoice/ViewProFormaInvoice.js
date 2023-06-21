import { CCardBody } from '@coreui/react'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import BackButton from 'src/components/Navigating/BackButton'
import ReactToPrint from 'react-to-print'
import InvoiceFooter from '../../Printing/InvoiceFooter'
import PrintTemplateInvoice from '../../Printing/PrintTemplateInvoice'
import ClientDetailsProForma from '../../Printing/ClientDetailsProForma'
import { DataGrid } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'

const ViewProFormaInvoice = React.forwardRef((props, ref) => {
  const navigate = useNavigate()
  const componentRef = useRef()
  const request = useSelector((state) => state.selection.selected)
  let proformaDetails
  if (request && request.ProformaDetails) {
    proformaDetails = request.ProformaDetails
  }
  const VATconstant = useSelector((state) =>
    state.constants.constants.filter((constant) => constant.name === 'VAT'),
  )[0] || { value: 0, name: 'VAT' }

  const orderTotal = request && request.total ? request.total : 0
  const amountVAT = Number((orderTotal * VATconstant.value) / 100)
  const total =
    proformaDetails[0].VAT === 'exclusive'
      ? Number(orderTotal - amountVAT)
      : Number(orderTotal + amountVAT)
  const [rows] = useState(request.ProformaDetails)
  const columns = [
    {
      headerName: 'Description',
      field: 'name',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
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
      minWidth: 200,
      maxWidth: 300,
    },
    {
      field: 'times',
      headerName: 'times',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      editable: false,
      sortable: false,
    },
    {
      field: 'price',
      headerName: 'P.U',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      editable: false,
      sortable: false,
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
      <div className="d-flex justify-content-between">
        <BackButton />
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-ghost-primary"
            onClick={() => {
              navigate('/booking/accounting/proformainvoice/transfer')
            }}
          >
            Transfer to invoice
          </button>
          {proformaDetails && proformaDetails.length !== 0 ? (
            <ReactToPrint
              trigger={() => (
                <button className="btn btn-ghost-primary">Print</button>
              )}
              content={() => ref || componentRef.current}
            />
          ) : null}
        </div>
      </div>

      <PrintTemplateInvoice ref={ref || componentRef}>
        <p className="text-center my-3 text-uppercase fw-bold ">
          Pro forma Invoice N &#176;{request.proformaGenerated}
        </p>
        <ClientDetailsProForma details={proformaDetails} request={request} />
        <div className="my-3 py-3">
          <p className="d-flex justify-content-around">
            <div className="col">
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
                    display: isLastRow(params) ? 'none' : 'flex',
                  },
                })}
              />
            </div>
          </p>
        </div>
        <p className="text-center py-1 my-1">
          Your satisfaction is our concern
        </p>
        <InvoiceFooter />
      </PrintTemplateInvoice>
    </div>
  )
})

export default ViewProFormaInvoice
