//jshint esversion:9
import React, { useEffect, useState } from 'react'
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
import { registerUser } from 'src/redux/Auth/authActions'
import { getRoles } from 'src/redux/Roles/RolesActions'
import { getUsers } from 'src/redux/User/userActions'
import { useForm } from 'react-hook-form'

const UserAdd = () => {
  const [formData, setformData] = useState({})

  const { register, handleSubmit, watch, reset } = useForm()

  const dispatch = useDispatch()
  const users = useSelector((state) => state.auth.users) || []
  const roles = useSelector((state) => state.roles.userRoles) || []
  // const handleChange = (e) => {
  //   setformData({ ...formData, [e.target.name]: e.target.value })
  // }
  const onSubmit = (data) => {
    dispatch(registerUser(data))
    reset()
  }

  useEffect(() => {
    dispatch(getRoles())
  }, [])

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h2>
                <strong> Add User </strong>
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
                    required
                    {...register('firstName')}
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
                    required
                    {...register('lastName')}
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
                    {...register('phone')}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="email">
                    {' '}
                    email <span className="text-warning">
                      {' '}
                      use for login{' '}
                    </span>{' '}
                  </CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="email"
                    id="email"
                    size="md"
                    required
                    {...register('email')}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="role"> Role </CFormLabel>
                  <CFormSelect
                    name="role"
                    id="role"
                    size="md"
                    className="mb-3"
                    aria-label="Room class"
                    {...register('role')}
                  >
                    <option>-- Select -- </option>
                    {roles && roles.length !== 0
                      ? roles.map((role) => (
                          <option value={role.id} key={role.id}>
                            {role.name}
                          </option>
                        ))
                      : null}
                  </CFormSelect>
                </CCol>
                <CCol xs={12}>
                  <CButton component="input" type="submit" value="Add a User" />
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default UserAdd
