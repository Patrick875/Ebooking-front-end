//jshint esversion:9
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { getRoles } from 'src/redux/Roles/RolesActions'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'
import BackButton from 'src/components/Navigating/BackButton'

const UserEdit = () => {
  const { register, handleSubmit, watch } = useForm()
  const selectedUser = useSelector((state) => state.selection.selected) || {}
  const roles = useSelector((state) => state.roles.userRoles) || []
  let formData = { ...selectedUser }
  let role = watch('role') || selectedUser.Role.name
  const dispatch = useDispatch()
  const reactivateUser = async (id) => {
    await instance
      .get(`/users/reactivate/${id}`)
      .then(() => {
        toast.success('user re-activated !!')
      })
      .catch((err) => {
        toast.error(err.status)
      })
  }

  const onSubmit = async (data) => {
    data.id = selectedUser.id ? selectedUser.id : null
    //updating users array
    data.role = selectedUser.Role.id || role

    console.log('user', { ...selectedUser, ...data })

    await instance
      .put('/users/update', data)
      .then(() => {
        toast.success('user updated')
      })
      .catch(() => {
        toast.error('user updated failed')
      })
  }

  useEffect(() => {
    dispatch(getRoles())
  }, [dispatch])

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <BackButton />
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between">
              <p>
                <strong> Edit user </strong>
              </p>
              {selectedUser.status !== 'ACTIVE' ? (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    reactivateUser(selectedUser.id)
                  }}
                >
                  ACTIVATE
                </button>
              ) : null}
            </CCardHeader>
            <CCardBody>
              <CForm
                className="row"
                name="roomClassAddFrm"
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form"
              >
                <CCol md={6}>
                  <CFormLabel htmlFor="firstName"> First name </CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="firstName"
                    id="firstName"
                    defaultValue={formData.firstName}
                    {...register('firstName')}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="lastName"> Last name </CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="lastName"
                    id="lastName"
                    defaultValue={formData.lastName}
                    {...register('lastName')}
                    required
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="phone"> Phone </CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="phone"
                    id="phone"
                    required
                    defaultValue={formData.phone ? formData.phone : ''}
                    {...register('phone')}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="email">
                    {' '}
                    email <span className="text-warning"> </span>{' '}
                  </CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="email"
                    id="email"
                    defaultValue={formData.email}
                    {...register('email')}
                    required
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="role"> Role </CFormLabel>
                  <CFormSelect
                    name="role"
                    id="role"
                    className="mb-3"
                    aria-label="update user role"
                    {...register('role')}
                  >
                    <option>-- Select -- </option>
                    {roles && roles.length !== 0
                      ? roles.map((role) => (
                          <option
                            value={role.id}
                            key={role._id}
                            selected={role.id === selectedUser.Role.id}
                          >
                            {role.name}
                          </option>
                        ))
                      : null}
                  </CFormSelect>
                </CCol>

                <CCol xs={12}>
                  <CButton
                    component="input"
                    type="submit"
                    value="Save changes"
                  />
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default UserEdit
