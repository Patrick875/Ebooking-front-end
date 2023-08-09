import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import BackButton from 'src/components/Navigating/BackButton'
import ReactToPrint from 'react-to-print'
import InvoiceHeader from '../../Printing/InvoiceHeader'
import DeliveryFooter from '../../Printing/DeliveryFooter'
import { useNavigate } from 'react-router-dom'
import { initialRowsDelivery } from 'src/utils/constants'
import { useForm } from 'react-hook-form'
import { instance } from 'src/API/AxiosInstance'
import { removeObjectsWithEmptyProperties } from 'src/utils/functions'
import { toast } from 'react-hot-toast'
import EditableTableWithDates from 'src/components/EditableTableWithDates'

const ViewDeliveryNote = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const navigate = useNavigate()
  const request = useSelector((state) => state.selection.selected)
  const role = useSelector((state) => state.auth.user.Role.name)
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
  let DeliveryNoteDetails
  if (request && request.DeliveryNoteDetails) {
    DeliveryNoteDetails = request.DeliveryNoteDetails
  }

  const [rows, setRows] = useState([
    ...request.DeliveryNoteDetails,
    ...initialRowsDelivery,
  ])

  const updateInvoice = async () => {
    let filtereDetails = removeObjectsWithEmptyProperties(rows)
    filtereDetails = filtereDetails.map((detail) => ({
      ...detail,
      name: detail.description,
    }))
    await instance
      .put('/deliveryNote/update', {
        id: request.id,
        clientDetails,
        details: filtereDetails,
      })
      .then(() => {
        setReadOnly(!readOnly)
        toast.success('Delivery note updated successfuly')
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
            navigate('/booking/accounting/delivery/transfer')
          }}
        >
          Transfer to invoice
        </button>
        <div className="d-flex justify-content-end">
          {DeliveryNoteDetails && DeliveryNoteDetails.length !== 0 ? (
            <ReactToPrint
              trigger={() => (
                <button className="btn btn-ghost-primary">Print</button>
              )}
              content={() => ref || componentRef.current}
            />
          ) : null}
        </div>
      </div>
      <div ref={ref || componentRef}>
        <div className="mx-4">
          <InvoiceHeader title="Delivery note" />
          <p className="text-center my-1 text-uppercase fw-bold">
            Delivery note N &#176; {request.deliveryNoteId}
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
                <p className="col my-0 d-flex justify-content-end">
                  <span className="fw-bold">DATE : </span>{' '}
                  {!request.date ? '' : request.date}
                </p>
              ) : null}
            </div>
          </div>
          <div className="my-3 py-3">
            <div className="d-flex justify-content-around">
              <div className="col">
                <EditableTableWithDates
                  data={rows}
                  setData={setRows}
                  readOnly={readOnly}
                  type="delivery"
                />
              </div>
            </div>
          </div>
          <DeliveryFooter />
        </div>
      </div>
    </div>
  )
})

export default ViewDeliveryNote
