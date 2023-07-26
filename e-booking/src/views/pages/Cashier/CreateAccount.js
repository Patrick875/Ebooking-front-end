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
  CRow,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'

function CreateAccount({ setNewAccount, setVisible }) {
  let loggedInUser = useSelector((state) => state.auth.user.Role.name)
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = async (data) => {
    await instance
      .post('/cashflow/account/create', data)
      .then((res) => {
        toast.success('customer created')
        setNewAccount(res.data.data)
        setVisible(false)
      })
      .catch((err) => {
        console.log({ err })
      })
    reset()
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h5>
              <strong> Add Account </strong>
            </h5>
          </CCardHeader>
          <CCardBody>
            <CForm
              className="row"
              name="AddFrm"
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form"
            >
              <CCol md={6}>
                <CFormLabel htmlFor="firstName"> Name </CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="name"
                  id="name"
                  required
                  {...register('name', { required: true })}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="firstName">Type </CFormLabel>
                <CFormSelect
                  className="mb-1"
                  type="text"
                  name="type"
                  id="type"
                  required
                  {...register('type', { required: true })}
                >
                  <option>IN</option>
                  <option>OUT</option>
                </CFormSelect>
              </CCol>

              <CCol xs={12} className="mt-2">
                <CButton
                  component="input"
                  className={`${
                    loggedInUser === 'controller' ? 'disabled' : ''
                  }`}
                  type="submit"
                  value="Create"
                />
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreateAccount
