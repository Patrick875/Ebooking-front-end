import React, { useState, useRef } from 'react'
import { CCol } from '@coreui/react'
import { toast } from 'react-hot-toast'
import ReactToPrint from 'react-to-print'
import { instance } from 'src/API/AxiosInstance'
import InvoiceFooter from '../../Printing/InvoiceFooter'
import PrintTemplateInvoice from '../../Printing/PrintTemplateInvoice'
import BackButton from 'src/components/Navigating/BackButton'
import { useSelector } from 'react-redux'
import ClientDetails from '../../Printing/ClientDetails'
import numberToWords from 'number-to-words'
import { initialRowsDelivery } from 'src/utils/constants'
import { removeObjectsWithEmptyProperties } from 'src/utils/functions'
import EditableTableWithDates from 'src/components/EditableTableWithDates'

const DeliveryToInvoiceTransfer = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const deliveryNote = useSelector((state) => state.selection.selected)
  const data = useSelector(
    (state) => state.selection.selected.DeliveryNoteDetails,
  )
  const [rows, setRows] = useState([...data, ...initialRowsDelivery])
  let [requestItems] = useState([...deliveryNote.DeliveryNoteDetails])
  const [created, setCreated] = useState()

  const submitRequest = async () => {
    let data
    const outsideData = {
      clientName: deliveryNote.clientName,
      clientType: deliveryNote.clientType,
      function: deliveryNote.function,
      deliveryLink: deliveryNote.id,
      currency: deliveryNote.currency,
      pax: deliveryNote.pax,
      total: total,
      vatTotal: value,
    }
    const allData = rows.map((el) => ({
      ...el,
      name: el.description,
      price: el.unitPrice,
      VAT: 'Inclusive',
    }))
    const details = removeObjectsWithEmptyProperties(allData)
    data = { ...outsideData, details }
    await instance
      .post('/invoices/add', { ...data })
      .then((res) => {
        console.log('res', res)
        toast.success('success')
        setCreated(res.data.data)
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
  const value =
    rows && rows.length !== 0
      ? rows.reduce((a, b) => a + Number(b.unitPrice * b.quantity * b.times), 0)
      : 0
  const amountVAT = Number((value * 18) / 118)
  const total = Number(value - amountVAT)
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
            <div className="mx-4">
              <p className="text-center text-uppercase my-3 fw-bold">
                Invoice N &#176; {created ? created.invoiceGenerated : null}
              </p>
              <ClientDetails details={rows} request={deliveryNote} />
              <div>
                <div xs={12}>
                  <div className="mb-4">
                    <div>
                      <EditableTableWithDates
                        data={rows}
                        setData={setRows}
                        readOnly={false}
                        type="delivery"
                      />
                    </div>
                    <p className="text-capitalize">
                      <span className="fw-bold"> Total in words : </span>
                      <span style={{ color: 'black' }}>
                        {total ? numberToWords.toWords(value) : null}
                      </span>{' '}
                      {deliveryNote.currency !== 'USD'
                        ? ' Rwandan Francs '
                        : ' US Dollars '}
                    </p>
                  </div>
                </div>
              </div>
              <InvoiceFooter />
            </div>
          </PrintTemplateInvoice>
        </div>
      </CCol>
    </div>
  )
})

export default DeliveryToInvoiceTransfer
