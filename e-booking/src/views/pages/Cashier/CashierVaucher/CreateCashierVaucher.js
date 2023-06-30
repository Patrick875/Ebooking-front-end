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

const CreateCashierVaucher = () => {
  let loggedInUser = useSelector((state) => state.auth.user.Role.name)
  const { register, handleSubmit, watch, reset } = useForm()
  const type = watch('type') || 'credit'
  const creditTransaction = async (data) => {
    await instance
      .post('/cashvaucher/credit', data)
      .then(() => {
        toast.success('Cash credited !!!')
        reset()
      })
      .catch(() => {
        toast.error('transaction failed !!!')
      })
  }
  const debitTransaction = async (data) => {
    await instance
      .post('/cashvaucher/debit', data)
      .then((res) => {
        toast.success(res.data.message)
        reset()
      })
      .catch(() => {
        toast.error('transaction failed !!!')
      })
  }
  const onSubmit = async (data) => {
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
              <strong> Cashier Vaucher </strong>
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
                    <option value="credit">Cash out</option>
                    <option value="debit">Cash in </option>
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
                      className="mb-3"
                      {...register('paymentMethod')}
                    >
                      <option value="Cash">Cash</option>
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
                  value="Submit"
                />
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreateCashierVaucher
