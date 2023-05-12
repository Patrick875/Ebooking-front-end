import React from 'react'
import { useForm } from 'react-hook-form'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'

const CashTransaction = () => {
  let loggedInUser = useSelector((state) => state.auth.user.Role.name)
  const { register, handleSubmit, watch, reset } = useForm()
  const type = watch('type') || 'credit'
  const creditTransaction = async (data) => {
    // delete data.type
    await instance
      .post('/cashflow/credit', data)
      .then(() => {
        toast.success('Cash credited !!!')
      })
      .catch(() => {
        toast.error('transaction failed !!!')
      })
  }
  const debitTransaction = async (data) => {
    //delete data.type
    await instance
      .post('/cashflow/debit', data)
      .then((res) => {
        toast.success(res.data.message)
      })
      .catch(() => {
        toast.error('transaction failed !!!')
      })
  }
  const onSubmit = async (data) => {
    console.log('dkasld', data)
    if (type === 'credit') {
      await creditTransaction(data)
    } else if (type === 'debit') {
      await debitTransaction(data)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> Cash transaction </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CForm name="cash-receive-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="mb-3 col-6">
                  <CFormLabel htmlFor="Account"> Transaction </CFormLabel>
                  <CFormSelect
                    type="text"
                    name="type"
                    id="type"
                    {...register('type')}
                  >
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </CFormSelect>
                </div>
                <div className="mb-3 col-6">
                  <CFormLabel htmlFor="Account">
                    {' '}
                    {type && type === 'credit' ? 'To' : 'From'} (name){' '}
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    name="To"
                    id="To"
                    placeholder=".....receiver name"
                    size="md"
                    {...register('doneTo')}
                  />
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col-6">
                  <CFormLabel htmlFor="amount"> Amount </CFormLabel>
                  <CFormInput
                    name="amount"
                    type="number"
                    min={0}
                    id="amount"
                    {...register('amount')}
                  />
                </div>
                <div className="mb-3 col-6">
                  <CFormLabel htmlFor="account"> Account </CFormLabel>
                  <CFormInput
                    name="account"
                    type="type"
                    id="amount"
                    {...register('account')}
                  ></CFormInput>
                </div>
              </div>

              <div className="row">
                <CCol md={6} className="d-flex gap-2">
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
                      <option value="Cash">Cash</option>
                      <option value="Mobile Money">Mobile Money</option>
                      <option value="Credit card">Credit card</option>
                      <option value="Credit">Credit</option>
                      <option value="Cheque">Cheque</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel htmlFor="description">
                    {' '}
                    Description/Reason{' '}
                  </CFormLabel>
                  <CFormTextarea
                    name="description"
                    id="description"
                    {...register('description')}
                  ></CFormTextarea>
                </CCol>
              </div>

              <CCol xs={12}>
                <CButton
                  component="input"
                  className={`${
                    loggedInUser === 'controller' ? 'disabled' : ''
                  }`}
                  type="submit"
                  value="Confirm"
                />
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CashTransaction
