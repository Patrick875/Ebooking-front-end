import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import BackButton from 'src/components/Navigating/BackButton'
import ReactToPrint from 'react-to-print'
import InvoiceFooter from '../../Printing/InvoiceFooter'
import PrintTemplateInvoice from '../../Printing/PrintTemplateInvoice'
import { useNavigate } from 'react-router-dom'
import numberToWords from 'number-to-words'

import { initialRows } from 'src/utils/constants'
import { removeObjectsWithEmptyProperties } from 'src/utils/functions'
import { instance } from 'src/API/AxiosInstance'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import EditableTableWithDates from 'src/components/EditableTableWithDates'

const ViewProFormaInvoice = React.forwardRef((props, ref) => {
  const navigate = useNavigate()
  const componentRef = useRef()
  const role = useSelector((state) => state.auth.user.Role.name)
  const request = useSelector((state) => state.selection.selected)
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
  const [readOnly, setReadOnly] = useState(true)

  let proformaDetails
  if (request && request.ProformaDetails) {
    proformaDetails = request.ProformaDetails
  }

  const [rows, setRows] = useState([...request.ProformaDetails, ...initialRows])
  const orderTotal =
    rows && rows.length !== 0
      ? rows.reduce((a, b) => a + Number(b.quantity * b.times * b.price), 0)
      : 0
  const amountVAT = Number((orderTotal * 18) / 100)
  const finalTotal = Number(orderTotal + amountVAT)

  const updateInvoice = async () => {
    const filtereDetails = removeObjectsWithEmptyProperties(rows)
    await instance
      .put('/proforma/update', {
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
  return (
    <div>
      <div className="d-flex justify-content-between">
        <BackButton />
        <div className="d-flex justify-content-end">
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
          <div className="col d-flex flex-row border border-2 border-dark">
            <div className="col p-2 my-0">
              <div className="my-0">
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
                <p className="col-4 my-0">
                  <span className="fw-bold">DATE : </span>{' '}
                  {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                </p>
              ) : null}
            </div>

            <div className="my-0 mx-2">
              <p className="fw-bold my-0 py-0">
                Expected Date of Arrival :{' '}
                <span className="fw-normal">
                  {request.dateIn
                    ? new Date(request.dateIn).toLocaleDateString('fr-FR')
                    : null}
                </span>
              </p>
              <p className="fw-bold my-0 py-0">
                Expected Date of Departure :{' '}
                <span className="fw-normal">
                  {request.dateOut
                    ? new Date(request.dateOut).toLocaleDateString('fr-FR')
                    : null}
                </span>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="col">
              <EditableTableWithDates
                data={rows}
                setData={setRows}
                readOnly={readOnly}
              />
            </div>
            <p className="text-capitalize">
              <span className="fw-bold"> Total in words :</span>
              {finalTotal ? numberToWords.toWords(finalTotal) : null}
              {request.currency !== 'USD' ? ' Rwandan Francs ' : ' US Dollars '}
            </p>
          </div>
        </div>

        <p className="text-center py-1 my-1">
          Your satisfaction is our concern
        </p>
        <InvoiceFooter request={request} />
      </PrintTemplateInvoice>
    </div>
  )
})

export default ViewProFormaInvoice
