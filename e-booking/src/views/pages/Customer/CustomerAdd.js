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
import { countries } from 'src/utils/constants'

function CustomerAdd({ setNewCustomer, setVisible }) {
  let loggedInUser = useSelector((state) => state.auth.user.Role.name)
  const { register, handleSubmit, watch, reset } = useForm()
  const customerType = watch('customerType') || 'individual'

  const onSubmit = async (data) => {
    if (customerType && customerType === 'company') {
      delete data['gender']
    }
    await instance
      .post('/customers/add', data)
      .then((res) => {
        if (res && res.data && res.data) {
          toast.success('customer created')
          setNewCustomer(res.data.data)
        }

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
              <strong> Add Customer </strong>
            </h5>
          </CCardHeader>
          <CCardBody>
            <CForm
              className="row"
              name="roomClassAddFrm"
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form"
            >
              <CCol md={6}>
                <CFormLabel htmlFor="givenname"> Given name</CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="givenname"
                  id="givenname"
                  placeholder="...givenname"
                  required
                  {...register('givenname', { required: true })}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="surname"> Surname</CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="surname"
                  id="surname"
                  placeholder="...surname"
                  required
                  {...register('surname', { required: true })}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="firstName"> Nationality </CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="nationality"
                  id="nationality"
                  required
                  {...register('nationality', { required: true })}
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel htmlFor="phone"> Tel </CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="phone"
                  id="phone"
                  required
                  {...register('phone')}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="email"> email </CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="email"
                  id="email"
                  {...register('email')}
                />
              </CCol>

              <CCol xs={12} className="mt-2">
                <CButton
                  component="input"
                  className={`${
                    loggedInUser === 'controller' ? 'disabled' : ''
                  }`}
                  type="submit"
                  value="Add Customer"
                />
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CustomerAdd
