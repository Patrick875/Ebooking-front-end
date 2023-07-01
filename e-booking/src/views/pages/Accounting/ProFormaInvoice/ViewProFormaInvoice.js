import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import BackButton from 'src/components/Navigating/BackButton'
import ReactToPrint from 'react-to-print'
import InvoiceFooter from '../../Printing/InvoiceFooter'
import PrintTemplateInvoice from '../../Printing/PrintTemplateInvoice'
import ClientDetailsProForma from '../../Printing/ClientDetailsProForma'
import { DataGrid } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'
import numberToWords from 'number-to-words'
import EditableTable from 'src/components/EditableTable'
import { initialRows } from 'src/utils/constants'

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
  const total = Number(orderTotal + amountVAT)
  console.log('total', { total, amountVAT, orderTotal, request })
  const [rows, setRows] = useState([...request.ProformaDetails, ...initialRows])

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
        <p className="text-center my-3 text-uppercase fw-bold "></p>
        <div className="col">
          <p className="text-center my-3 text-uppercase fw-bold">
            Pro forma Invoice N &#176;
            {request.proformaGenerated}
          </p>
          <ClientDetailsProForma details={proformaDetails} request={request} />
          <div className="col">
            <div className="col">
              <EditableTable data={rows} setData={setRows} readOnly={true} />
            </div>
            <p className="text-capitalize">
              <span className="fw-bold"> Total in words : </span>
              {total ? numberToWords.toWords(total) : null}{' '}
              {request.currency !== 'USD' ? ' Rwandan Francs ' : ' US Dollars '}
            </p>
          </div>
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
