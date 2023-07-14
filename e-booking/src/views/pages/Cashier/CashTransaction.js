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
import ReactDatePicker from 'react-datepicker'
import { useState } from 'react'

const CashTransaction = () => {
  let loggedInUser = useSelector((state) => state.auth.user.Role.name)
  const { register, handleSubmit, watch, reset } = useForm()
  const [date, setDate] = useState(new Date())
  const type = watch('type') || 'credit'
  const creditTransaction = async (data) => {
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
    if (type === 'credit') {
      await creditTransaction({
        ...data,
        date: new Date(date.toString()).getTime(),
      })
    } else if (type === 'debit') {
      await debitTransaction({
        ...data,
        date: new Date(date.toString()).getTime(),
      })
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
                  <CFormLabel htmlFor="account">
                    {' '}
                    Account /Purchase number
                  </CFormLabel>
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
                      <option value="Mobile Money">Mobile Money</option>
                      <option value="Credit card">Credit card</option>
                      <option value="Credit">Credit</option>
                      <option value="Cheque">Cheque</option>
                    </CFormSelect>
                  </div>
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="date of arrival">
                    {' '}
                    Expected date of Arrival{' '}
                  </CFormLabel>
                  <ReactDatePicker
                    className="form-control"
                    timeFormat="p"
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    popperPlacement="bottom-end"
                    onChange={(date) => setDate(date)}
                    placeholderText="Select a date other than  yesterday"
                  />
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
