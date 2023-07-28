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
                <CFormLabel htmlFor="firstName"> Names </CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="names"
                  id="names"
                  placeholder="...firstname & lastname"
                  required
                  {...register('names', { required: true })}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="firstName"> Country </CFormLabel>
                <CFormSelect
                  className="mb-1"
                  type="text"
                  name="nationality"
                  id="nationality"
                  required
                  {...register('nationality', { required: true })}
                >
                  {countries && countries.length !== 0
                    ? countries.map((country, i) => (
                        <option key={country + i} value={country}>
                          {country}
                        </option>
                      ))
                    : null}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="customer_type"> Type </CFormLabel>
                <CFormSelect
                  name="type"
                  id="type"
                  className="mb-3"
                  aria-label="customer type"
                  {...register('customerType', { required: true })}
                >
                  <option value="individual"> Individual </option>
                  <option value="company"> Company </option>
                </CFormSelect>
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

              <CCol title="use TIN for customer companies" md={6}>
                <CFormLabel htmlFor=" id">
                  {customerType && customerType === 'company'
                    ? 'TIN'
                    : 'ID / Passport'}
                </CFormLabel>

                <CFormInput
                  className="mb-1"
                  type="text"
                  name="id"
                  id="id"
                  required
                  {...register('identification', { required: true })}
                />
              </CCol>
              {customerType && customerType === 'individual' ? (
                <CCol md={6}>
                  <CFormLabel htmlFor="gender"> Gender</CFormLabel>
                  <CFormSelect
                    name="gender"
                    id="gender"
                    className="mb-3"
                    aria-label="gender"
                    {...register('gender')}
                  >
                    <option value="female"> Female</option>
                    <option value="male">Male </option>
                    <option value="other">Other </option>
                  </CFormSelect>
                </CCol>
              ) : null}

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
