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

const UserEdit = () => {
  const { register, handleSubmit, watch } = useForm()
  let users = useSelector((state) => state.systemUsers.users)
  const selectedUser = useSelector((state) => state.selection.selected) || {}
  const roles = useSelector((state) => state.roles.userRoles) || []
  let formData = { ...selectedUser }
  let role = watch('role') || selectedUser.Role.name
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    data.id = selectedUser.id ? selectedUser.id : null
    //updating users array

    users = users.map((user) =>
      user._id === selectedUser._id ? (user = { ...user, ...data }) : user,
    )
    data.role = selectedUser.Role.name || role

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
          <CCard className="mb-4">
            <CCardHeader>
              <h2>
                <strong> Edit user </strong>
              </h2>
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
                    size="md"
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
                    size="md"
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
                    size="md"
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
                    size="md"
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
                    size="md"
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
