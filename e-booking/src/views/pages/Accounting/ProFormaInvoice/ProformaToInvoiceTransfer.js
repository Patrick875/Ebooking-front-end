import React, { useState, useRef } from 'react'
import { CCol } from '@coreui/react'
import { DataGrid } from '@mui/x-data-grid'
import { toast } from 'react-hot-toast'
import ReactToPrint from 'react-to-print'
import { instance } from 'src/API/AxiosInstance'
import InvoiceFooter from '../../Printing/InvoiceFooter'
import PrintTemplateInvoice from '../../Printing/PrintTemplateInvoice'
import BackButton from 'src/components/Navigating/BackButton'
import { useSelector } from 'react-redux'
import ClientDetails from '../../Printing/ClientDetails'
import numberToWords from 'number-to-words'

const ProformaToInvoiceTransfer = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const proforma = useSelector((state) => state.selection.selected)
  const data = useSelector((state) => state.selection.selected.ProformaDetails)
  const [rows, setRows] = useState([...data])
  const [created, setCreated] = useState()
  const submitRequest = async () => {
    let data
    const outsideData = {
      clientName: proforma.clientName,
      clientType: proforma.clientType,
      function: proforma.function,
    }
    const allData = rows.map((el) => ({
      ...el,
      VAT: 'Inclusive',
    }))
    data = { ...outsideData, details: allData }

    await instance
      .post('/invoices/add', data)
      .then((res) => {
        toast.success('success')
        setCreated(res.data.data)
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }
  const VATconstant = useSelector((state) =>
    state.constants.constants.filter((constant) => constant.name === 'VAT'),
  )[0] || { value: 0, name: 'VAT' }
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
      editable: true,
      hide: (params) => params.rowIndex === rows.length,
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      valueSetter: (params) => {
        const updateRow = {
          ...params.row,
          quantity: params.value,
        }
        let newRows = rows.map((item) =>
          item.id === params.row.id
            ? { ...params.row, quantity: params.value }
            : item,
        )
        setRows([...newRows])
        return updateRow
      },
    },
    {
      field: 'times',
      headerName: 'times',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      editable: true,
      hide: (params) => params.rowIndex === rows.length,
      sortable: false,
      valueGetter: (params) => `${params.row.times}`,
      valueSetter: (params) => {
        const updateRow = {
          ...params.row,
          times: params.value,
        }
        let newRows = rows.map((item) =>
          item.id === params.row.id
            ? { ...params.row, times: params.value }
            : item,
        )
        setRows([...newRows])
        return updateRow
      },
    },
    {
      field: 'price',
      headerName: 'P.U',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      editable: true,
      sortable: false,
      hide: (params) => params.rowIndex === rows.length,
      valueGetter: (params) => `${params.row.price}`,
      valueSetter: (params) => {
        const updateRow = {
          ...params.row,
          price: params.value,
        }
        let newRows = rows.map((item) =>
          item.id === params.row.id
            ? { ...params.row, price: params.value }
            : item,
        )
        setRows([...newRows])
        return updateRow
      },
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
          params.row.total ||
          0
        } `,
    },
  ]
  const value =
    rows && rows.length !== 0
      ? rows.reduce((a, b) => a + Number(b.price * b.quantity * b.times), 0)
      : 0
  const VAT = rows && rows.length !== 0 ? data[0].VAT : 'inclusive'
  const amountVAT = Number((value * VATconstant.value) / 100)
  const total =
    VAT === 'exclusive' ? Number(value - amountVAT) : Number(value + amountVAT)
  const valueRow = {
    id: 3000,
    name: 'VALUE',
    flex: 1,
    minWidth: 200,
    maxWidth: 300,
    quantity: '',
    times: '',
    price: '',
    total: value,
  }
  const vatRow = {
    id: 2000,
    name: 'VAT',
    flex: 1,
    minWidth: 200,
    maxWidth: 300,
    quantity: '',
    times: '',
    price: '',
    total: amountVAT,
  }
  const totalRow = {
    id: 1000,
    name: 'Total',
    flex: 1,
    minWidth: 200,
    maxWidth: 300,
    quantity: '',
    times: '',
    price: '',
    total: total,
  }
  const isLastRow = (params) => params.row.id === totalRow.id

  return (
    <div>
      <BackButton />
      <CCol xs={12}>
        <div className="mb-4">
          <div className="d-flex justify-content-between">
            <p className="text-uppercase text-center">
              <strong> Transfer to Invoice </strong>
            </p>
            <p
              className="text-primary"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                submitRequest()
              }}
            >
              Create invoice
            </p>
            <ReactToPrint
              trigger={() => (
                <button className="btn btn-ghost-primary">Print</button>
              )}
              content={() => ref || componentRef.current}
            />
          </div>
          <PrintTemplateInvoice ref={ref || componentRef}>
            <p className="text-center text-uppercase my-3 fw-bold">
              Invoice N &#176; {created ? created.invoiceGenerated : null}
            </p>
            <ClientDetails
              details={proforma.ProformaDetails}
              request={proforma}
            />
            <div>
              <div xs={12} className="my-0 py-0">
                <DataGrid
                  sx={{
                    '& .MuiDataGrid-cell': {
                      border: '2px solid black ',
                    },
                    '& .MuiDataGrid-columnHeader': {
                      border: '2px solid black ',
                    },
                  }}
                  rows={[...rows, valueRow, vatRow, totalRow]}
                  columns={columns}
                  hideFooter={true}
                  getColumnProps={(params) => ({
                    style: {
                      display: isLastRow(params) ? 'none' : 'flex',
                    },
                  })}
                />
              </div>
              <p className="text-capitalize">
                {total ? numberToWords.toWords(total) : null} Rwandan Francs
              </p>
            </div>

            <InvoiceFooter />
          </PrintTemplateInvoice>
        </div>
      </CCol>
    </div>
  )
})

export default ProformaToInvoiceTransfer
