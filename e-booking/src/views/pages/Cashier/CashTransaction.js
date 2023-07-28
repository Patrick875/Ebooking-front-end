import React, { useEffect } from 'react'
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
  CModal,
  CRow,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'
import ReactDatePicker from 'react-datepicker'
import { useState } from 'react'
import CreateAccount from './CreateAccount'
import { Link } from 'react-router-dom'

const CreateAccountModal = (props) => {
  const { visible, setVisible, setNewAccount } = props
  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={() => setVisible(false)}
      size="lg"
    >
      <CreateAccount setNewAccount={setNewAccount} setVisible={setVisible} />
    </CModal>
  )
}

const CashTransaction = () => {
  let loggedInUser = useSelector((state) => state.auth.user.Role.name)
  const { register, handleSubmit, watch, reset } = useForm()
  const [date, setDate] = useState(new Date())
  const [visible, setVisible] = useState(false)
  const [newAccount, setNewAccount] = useState()
  const [accounts, setAccounts] = useState([])
  const type = watch('type') || 'credit'
  const account = watch('account')
  const accountId =
    account === ''
      ? 1
      : accounts && accounts.length !== 0
      ? accounts.filter((el) => el.name === account)[0].id
      : 1
  const creditTransaction = async (data) => {
    console.log('data', data)
    await instance
      .post('/cashflow/credit', data)
      .then((res) => {
        console.log('res', res)
        toast.success('Cash credited !!!')
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
  const debitTransaction = async (data) => {
    console.log('data', data)
    if (data.account === '') {
      data.account = 'CASH'
    }

    await instance
      .post('/cashflow/debit', data)
      .then((res) => {
        console.log('res', res)
        toast.success(res.data.message)
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
  const onSubmit = async (data) => {
    console.log('data', data)

    data = {
      ...data,
      accountId: accountId,
      date: new Date(date.toString()).getTime(),
    }
    if (type === 'credit') {
      await creditTransaction({
        ...data,
      })
    } else if (type === 'debit') {
      await debitTransaction({
        ...data,
      })
    }
  }
  useEffect(() => {
    const getAccounts = async () => {
      await instance
        .get('/cashflow/account/all')
        .then((res) => {
          if (res.data.data) {
            setAccounts(res.data.data)
            console.log('accounts', res.data.data)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    getAccounts()
  }, [newAccount])
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
                  <div className=" col d-flex flex-row justify-content-between">
                    <CFormLabel htmlFor="customer" className="d-block">
                      {' '}
                      Account{' '}
                    </CFormLabel>

                    <Link
                      className="d-block text-decoration-none"
                      onClick={() => setVisible(!visible)}
                    >
                      Create account
                    </Link>
                  </div>
                  <CFormSelect
                    name="account"
                    id="amount"
                    {...register('account')}
                  >
                    <option selected value=""></option>
                    {accounts && accounts.length !== 0
                      ? accounts.map((el) => (
                          <option key={el.id} value={el.name}>
                            {el.name}
                          </option>
                        ))
                      : null}
                  </CFormSelect>
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
                  <CFormLabel htmlFor="date of transa"> Date </CFormLabel>
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
                  value="Submit"
                />
              </CCol>
            </CForm>
          </CCardBody>
          <CreateAccountModal
            visible={visible}
            setVisible={setVisible}
            setNewAccount={setNewAccount}
          />
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CashTransaction
