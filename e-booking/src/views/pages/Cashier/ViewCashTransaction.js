import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
} from '@coreui/react'
import PrintHeader from '../Printing/PrintHeader'
import { useForm } from 'react-hook-form'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

const ViewCashTransaction = (props) => {
  const { transaction, update, setUpdate, setNewVersion } = props
  const { register, getValues } = useForm()
  const updateTransaction = async (data) => {
    await instance
      .post('/cashflow/update', { id: transaction.id, ...data })
      .then((res) => {
        if (res.status === 200) {
          toast.success('Transaction updated successfuly')
          setNewVersion(res.data.data)
          setUpdate(!update)
        } else {
          toast.success('Action responded with err', res.status)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  return (
    <CCard>
      <CCardBody>
        <CForm
          className="row"
          name="reservationViewFrm"
          encType="multipart/form"
        >
          <div className="p-2">
            <PrintHeader />

            <p className="fw-bolder text-center text-uppercase ">
              {' '}
              Transaction {transaction.transactionId}
            </p>
            <div className="px-4">
              <div className="d-flex justify-content-between gap-3">
                <div className="col-6">
                  <CFormLabel> Names</CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="names"
                    id="names"
                    required
                    {...register('doneTo')}
                    readOnly={update}
                    defaultValue={transaction.doneTo}
                  />
                </div>
                <div className="col-6">
                  <CFormLabel>Amount</CFormLabel>
                  <input
                    className="mb-1 form-control"
                    name="amount"
                    id="amount"
                    type="number"
                    required
                    readOnly={update}
                    {...register('amount')}
                    defaultValue={Number(transaction.amount)}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between gap-3">
                <div className="col-6">
                  <CFormLabel>Reason</CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="reason"
                    id="reason"
                    required
                    {...register('description')}
                    readOnly={update}
                    defaultValue={transaction.description}
                  />
                </div>
                <div className="col-6">
                  <CFormLabel>Done by</CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="doneBy"
                    id="doneBy"
                    readOnly
                    required
                    defaultValue={
                      transaction.User.firstName +
                      ' ' +
                      transaction.User.lastName
                    }
                  />
                </div>
              </div>
            </div>
            <p className="pt-2 px-4">
              <span className="fw-bold">Done on </span> :{' '}
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>
          {!update ? (
            <div>
              <CButton
                onClick={() => {
                  const data = getValues()
                  updateTransaction(data)
                }}
              >
                Submit update
              </CButton>
            </div>
          ) : null}
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default ViewCashTransaction
