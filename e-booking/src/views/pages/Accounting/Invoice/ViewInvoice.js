import { CCardHeader } from '@coreui/react'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import BackButton from 'src/components/Navigating/BackButton'
import ReactToPrint from 'react-to-print'
import InvoiceHeader from '../../Printing/InvoiceHeader'
import InvoicePaymentModal from './InvoicePaymentModal'
import { RiStethoscopeLine } from 'react-icons/ri'
import InvoiceFooter from '../../Printing/InvoiceFooter'
import numberToWords from 'number-to-words'
import { initialRows } from 'src/utils/constants'
import { useForm } from 'react-hook-form'
import { instance } from 'src/API/AxiosInstance'
import { removeObjectsWithEmptyProperties } from 'src/utils/functions'
import { toast } from 'react-hot-toast'
import EditableTableWithDates from 'src/components/EditableTableWithDates'

const ViewInvoice = React.forwardRef((props, ref) => {
  const componentRef = useRef()

  const request = useSelector((state) => state.selection.selected)
  const role = useSelector((state) => state.auth.user.Role.name)
  const [open, setOpen] = useState(false)
  const [readOnly, setReadOnly] = useState(true)
  const { register, watch } = useForm({
    defaultValues: {
      clientDetails: {
        clientName: request.clientName,
        pax: request.pax,
        function: request.function,
        clientType: request.clientType,
      },
    },
  })
  const clientDetails = watch('clientDetails')
  let invoiceDetails
  if (request && request.InvoiceDetails) {
    invoiceDetails = request.InvoiceDetails
  }
  const [rows, setRows] = useState([...request.InvoiceDetails, ...initialRows])

  const updateInvoice = async () => {
    const filtereDetails = removeObjectsWithEmptyProperties(rows)
    await instance
      .put('/invoices/update', {
        id: request.id,
        clientDetails,
        details: filtereDetails,
      })
      .then(() => {
        setReadOnly(!readOnly)
        toast.success('invoice updated successfuly')
      })
      .catch((err) => {
        setReadOnly(!readOnly)
        console.log('err', err)
      })
  }

  const orderTotal =
    rows && rows.length !== 0
      ? rows.reduce((a, b) => a + Number(b.quantity * b.times * b.price), 0)
      : 0
  const amountVAT = Number((orderTotal * 18) / 100)
  const finalTotal = Number(orderTotal + amountVAT)

  return (
    <div>
      <CCardHeader className="d-flex justify-content-between">
        <BackButton />
        <div className="d-flex justify-content-end gap-2">
          {role === 'admin' || role === 'General Accountant' ? (
            <div className="d-flex gap-2">
              {!readOnly ? (
                <button
                  className="btn btn-success"
                  onClick={() => {
                    updateInvoice()
                  }}
                >
                  Submit Update
                </button>
              ) : null}

              <button
                className="btn btn-ghost-dark"
                onClick={() => {
                  setReadOnly(!readOnly)
                }}
              >
                Update
              </button>
            </div>
          ) : null}
          <button
            className="btn btn-ghost-primary"
            disabled={
              Number(
                request.vatTotal -
                  request.InvoicePayments.reduce((acc, b) => acc + b.amount, 0),
              ) === 0
                ? true
                : false
            }
            onClick={() => {
              setOpen(true)
            }}
          >
            Add Payment
          </button>

          {invoiceDetails && invoiceDetails.length !== 0 ? (
            <ReactToPrint
              trigger={() => (
                <button className="btn btn-ghost-primary">Print</button>
              )}
              content={() => ref || componentRef.current}
            />
          ) : null}
        </div>
      </CCardHeader>
      <p className="fs-6">
        Payment status :{' '}
        <span className="text-capitalize">
          {request.InvoicePayments && request.InvoicePayments.length !== 0
            ? Number(
                request.InvoicePayments.reduce((acc, b) => acc + b.amount, 0),
              ) +
              ' paid  ' +
              Number(
                request.vatTotal -
                  request.InvoicePayments.reduce((acc, b) => acc + b.amount, 0),
              ) +
              ' remaining'
            : request.status}
        </span>{' '}
      </p>
      {request.deliveryLink ? (
        <p className="fs-6">
          Linked to delivery note n: {request.deliveryLink}
        </p>
      ) : null}

      <div ref={ref || componentRef} className="accounting">
        <InvoiceHeader />
        <p className="text-center text-uppercase my-3 fw-bold">
          Invoice N &#176; {request.invoiceGenerated}
        </p>
        <div className="col d-flex flex-row border border-2 border-dark">
          <div className="col p-2 my-0">
            <div className="my-0">
              {request ? (
                <p className="fw-bolder text-capitalize my-0 d-flex gap-2">
                  {request.clientType} :{' '}
                  <p className="py-0 my-0">
                    <input
                      defaultValue={request.clientName}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        width: '100%',
                      }}
                      {...register('clientDetails.clientName')}
                      readOnly={readOnly}
                      type="text"
                    />
                  </p>
                </p>
              ) : null}

              <p className="my-0 d-flex gap-2">
                Function:{' '}
                <p className="py-0 my-0">
                  <input
                    defaultValue={request.function}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      width: '100%',
                    }}
                    {...register('clientDetails.function')}
                    readOnly={readOnly}
                    type="text"
                  />
                </p>
              </p>
              <p className="my-0 d-flex gap-2 ">
                Number of Pax:
                <p className="py-0 my-0">
                  <input
                    defaultValue={request.pax}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      width: '100%',
                    }}
                    {...register('clientDetails.pax')}
                    readOnly={readOnly}
                    type="number"
                  />
                </p>
              </p>
            </div>
            {request ? (
              <p className="col my-0 d-flex justify-content-end ">
                <span className="fw-bold border border-2 border-dark p-1">
                  DATE :
                  {new Date(request.createdAt).toLocaleDateString('fr-FR')}{' '}
                </span>{' '}
              </p>
            ) : null}
          </div>
        </div>
        <div className="my-1 py-1">
          <div className="d-flex justify-content-around my-0 py-0">
            <div className="col ">
              <EditableTableWithDates
                data={rows}
                setData={setRows}
                readOnly={readOnly}
              />
            </div>
          </div>
          <p className="text-capitalize">
            <span className="fw-bold"> Total in words :</span>
            {finalTotal ? numberToWords.toWords(finalTotal) : null}
            {request.currency !== 'USD' ? ' Rwandan Francs ' : ' US Dollars '}
          </p>
        </div>
        <InvoiceFooter request={request} />
      </div>
      <InvoicePaymentModal
        maxPayment={Number(
          request.vatTotal -
            request.InvoicePayments.reduce((acc, b) => acc + b.amount, 0),
        )}
        invoice={request}
        open={open}
        setOpen={RiStethoscopeLine}
      />
    </div>
  )
})

export default ViewInvoice
