import {
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'

export default function InvoicePaymentModal(props) {
  let { open, setOpen, invoice, maxPayment } = props
  console.log('id', invoice.id)
  const { register, handleSubmit, reset, watch } = useForm()
  const amount = watch('amount')

  const addInvoicePayment = async (data) => {
    data = { ...data, invoiceId: invoice.id }
    console.log('data', data)
    await instance
      .post('/invoices/payment', data)
      .then((res) => {
        toast.success('invoice payment added')
        reset()
      })
      .catch((err) => {
        toast.error('invoice payment failed !!')
        console.log('err', err)
        reset()
      })
  }

  return (
    <React.Fragment>
      <CModal
        size="lg"
        alignment="center"
        visible={open}
        onClose={() => setOpen(!open)}
      >
        <CForm onSubmit={handleSubmit(addInvoicePayment)}>
          <CModalHeader>
            <CModalTitle className="col text-center">
              Add invoice payment
            </CModalTitle>
          </CModalHeader>

          <CModalBody>
            <p>Debt remaining :{maxPayment.toLocaleString()}</p>
            <CRow>
              <CCol>
                <CFormLabel htmlFor="payment">Payment</CFormLabel>
                <CFormInput
                  name="payment"
                  id="payment"
                  type="text"
                  size="md"
                  className="mb-3"
                  min={0}
                  max={maxPayment}
                  {...register('amount')}
                />
              </CCol>
              <CCol>
                <div className="col">
                  <CFormLabel htmlFor="paymentMethod">
                    Payment method
                  </CFormLabel>
                  <CFormSelect
                    name="paymentMethod"
                    id="paymentMethod"
                    size="md"
                    className="mb-3"
                    {...register('paymentMethod')}
                  >
                    <option value="Credit">Bank</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                  </CFormSelect>
                </div>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CFormLabel htmlFor="paymentIdentification">
                  Payment Identification
                </CFormLabel>
                <CFormInput
                  name="paymentIdentification"
                  id="paymentIdentification"
                  type="text"
                  size="md"
                  className="mb-3"
                  {...register('paymentIdentification')}
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={
                amount &&
                Number(amount) &&
                (Number(amount) > maxPayment || Number(amount) < 0)
                  ? true
                  : false
              }
            >
              Add payment
            </button>
            {amount && Number(amount) ? (
              Number(amount > maxPayment) ? (
                <p className="m-1 text-danger fs-5 fw-bold border border-1 border-danger">
                  Can't not more than the required amount
                </p>
              ) : Number(amount < 0) ? (
                <p className="m-1 text-danger fs-5 fw-bold border border-1 border-danger">
                  Amount must be greater than 0
                </p>
              ) : null
            ) : null}
          </CModalFooter>
        </CForm>
      </CModal>
    </React.Fragment>
  )
}

// onSubmit={handleSubmit(updatePrice)}