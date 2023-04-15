import React, { useEffect, useState } from 'react'
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

const CashReceive = () => {
  let loggedInUser = useSelector((state) => state.auth.user.Role.name)
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = async (data) => {
    // await instance
    //   .post('/room/add', data)
    //   .then(() => {
    //     toast.success('Room created')
    //   })
    //   .catch((err) => {
    //     toast.error(err.message)
    //     toast.error('Room  create failed')
    //   })
    // reset()
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> Add cash to safe </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CForm name="cash-receive-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <CFormLabel htmlFor="Account">
                  {' '}
                  From (Account number){' '}
                </CFormLabel>
                <CFormSelect
                  type="text"
                  name="account number"
                  id="account number"
                  placeholder=".....account number"
                  size="md"
                  {...register('account')}
                >
                  <option>0000000000</option>
                  <option>0000000000</option>
                </CFormSelect>
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="amount"> Description </CFormLabel>
                <CFormInput
                  name="amount"
                  id="amount"
                  rows="3"
                  {...register('amount')}
                ></CFormInput>
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="description">
                  {' '}
                  Description/Reason{' '}
                </CFormLabel>
                <CFormTextarea
                  name="description"
                  id="description"
                  rows="3"
                  {...register('description')}
                ></CFormTextarea>
              </div>
              <CCol xs={12}>
                <CButton
                  component="input"
                  className={`${
                    loggedInUser === 'controller' ? 'disabled' : ''
                  }`}
                  type="submit"
                  value="Add cash"
                />
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CashReceive
