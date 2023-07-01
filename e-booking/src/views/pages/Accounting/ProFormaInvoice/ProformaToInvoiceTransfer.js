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
import EditableTable from 'src/components/EditableTable'
import { initialRows } from 'src/utils/constants'
import { removeObjectsWithEmptyProperties } from 'src/utils/functions'

const ProformaToInvoiceTransfer = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const proforma = useSelector((state) => state.selection.selected)
  const data = useSelector((state) => state.selection.selected.ProformaDetails)
  const [rows, setRows] = useState([...data, ...initialRows])
  const [created, setCreated] = useState()
  const submitRequest = async () => {
    let data
    const outsideData = {
      clientName: proforma.clientName,
      clientType: proforma.clientType,
      function: proforma.function,
      currency: proforma.currency,
    }
    let allData = rows.map((el) => ({
      ...el,
      VAT: 'Inclusive',
    }))
    allData = removeObjectsWithEmptyProperties(allData)
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
  const value =
    rows && rows.length !== 0
      ? rows.reduce((a, b) => a + Number(b.price * b.quantity * b.times), 0)
      : 0
  const VAT = rows && rows.length !== 0 ? data[0].VAT : 'inclusive'
  const amountVAT = Number((value * VATconstant.value) / 100)
  const total =
    VAT === 'exclusive' ? Number(value - amountVAT) : Number(value + amountVAT)

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
          <div className="px-0 mx-0 my-0 mx-0 accounting">
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
                  <EditableTable data={rows} setData={setRows} />
                </div>
                <p className="text-capitalize">
                  <span className="fw-bold"> Total in words : </span>
                  {total ? numberToWords.toWords(total) : null}{' '}
                  {proforma.currency !== 'USD'
                    ? ' Rwandan Francs '
                    : ' US Dollars '}
                </p>
              </div>

              <InvoiceFooter />
            </PrintTemplateInvoice>
          </div>
        </div>
      </CCol>
    </div>
  )
})

export default ProformaToInvoiceTransfer
