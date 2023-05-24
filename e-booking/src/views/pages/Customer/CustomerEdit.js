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
import { instance, getTokenPromise } from 'src/API/AxiosInstance'
import BackButton from 'src/components/Navigating/BackButton'

function CustomerEdit() {
  const selectedCustomer = useSelector((state) => state.selection.selected)
  const { register, handleSubmit, watch, reset } = useForm()
  const customerType = watch('customerType') || 'individual'
  const loggedInUser = useSelector((state) => state.auth.role)
  const onSubmit = async (data) => {
    console.log('903184-04389148-')
    if (customerType && customerType === 'company') {
      delete data['gender']
    }

    //update user
    await instance
      .put('/customers/update', { ...data, id: selectedCustomer.id })
      .then(() => {
        toast.success('customer updated successfully')
      })
      .catch(() => {
        toast.error('customer update failed')
      })
    reset()
  }
  return (
    <CRow>
      <CCol xs={12}>
        <BackButton />
        <CCard className="mb-4">
          <CCardHeader>
            <h5>
              <strong> Edit Customer </strong>
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
                  defaultValue={selectedCustomer.names}
                  placeholder="...firstname & lastname"
                  required
                  {...register('names', { required: true })}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="customer_type"> Type </CFormLabel>
                <CFormSelect
                  name="type"
                  id="type"
                  className="mb-3"
                  defaultValue={selectedCustomer.customerType}
                  disabled={true}
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
                  defaultValue={selectedCustomer.phone}
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
                  defaultValue={selectedCustomer.email}
                  required
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
                  defaultValue={selectedCustomer.identification}
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
                    disabled={selectedCustomer.gender ? false : true}
                    defaultValue={
                      selectedCustomer.gender ? selectedCustomer.gender : ''
                    }
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
                  value="Update Customer"
                />
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CustomerEdit
