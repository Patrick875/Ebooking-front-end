import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { instance } from 'src/API/AxiosInstance'
import _nav from 'src/_nav'

function UserRolesEdit() {
  const { register, handleSubmit, watch, reset } = useForm()
  const userRoleObject = useSelector((state) => state.selection.selected.access)
  const userRole = useSelector((state) => state.selection.selected)
  const userAccessFields = Object.keys(userRoleObject)
  let items = _nav
  const [loading, setLoading] = useState(false)
  let access = watch('access') || userAccessFields
  items = items.filter((item) => item.name !== 'Dashboard')
  const accessArray = items.map((e) => e.name.toLowerCase())
  let itemsWithSubs = items.map((item) =>
    item.items ? item.name.toLowerCase() : null,
  )
  itemsWithSubs = itemsWithSubs.filter(Boolean)
  let itemsForAccess =
    items.map((item) =>
      itemsWithSubs.includes(item.name.toLowerCase()) ? item : null,
    ) || []
  itemsForAccess = itemsForAccess.filter(Boolean)

  const onSubmit = async (data) => {
    data.access = data.access.reduce((obj, e) => {
      obj[e] = data[e].permission ? data[e].permission : data[e]
      return obj
    }, {})
    let arr = Object.keys(data.access)
    let arr2 = Object.keys(data)
    for (let i = 0; i < arr2.length; i++) {
      if (arr.includes(arr2[i])) {
        delete data[arr2[i]]
      }
    }

    for (let key in data.access) {
      if (
        data.access.hasOwnProperty(key) &&
        data.access[key].permission === false
      ) {
        delete data.access[key]
      }
    }

    data = { id: userRole.id, name: data.name, access: data.access }

    setLoading(true)
    await instance
      .put('/roles/update', { ...data })
      .then(() => {
        toast.success('user role updated')
        reset()
      })
      .catch(() => {
        toast.error('user role not updated')
        reset()
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader>
          <h2>
            <strong> Add Role </strong>
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
              <CFormLabel htmlFor="Role name"> Name </CFormLabel>
              <CFormInput
                className="mb-1"
                type="text"
                name="role"
                id="role"
                defaultValue={userRole.name}
                required
                {...register('name')}
              />
            </CCol>

            <CRow>
              <CCol>
                <p className="fw-bolder"> Role Access</p>
                <div>
                  {accessArray && accessArray.length !== 0
                    ? accessArray.map((role, i) => (
                        <div>
                          <CFormCheck
                            key={i + 100}
                            id={`Access${i + 1}`}
                            value={role}
                            label={role}
                            defaultChecked={userAccessFields.includes(role)}
                            className="text-capitalize"
                            {...register(`access`)}
                          />
                          {access &&
                          access.length !== 0 &&
                          access.includes(role) ? (
                            <div>
                              {itemsWithSubs.includes(role) ? (
                                <div className="ps-3 pb-3">
                                  <p className="fw-bolder">Permissions</p>
                                  {itemsForAccess
                                    .filter(
                                      (item) =>
                                        item.name.toLowerCase() === role,
                                    )[0]
                                    .items.map((item, i) => (
                                      <CFormCheck
                                        key={i * 100}
                                        id={`"permission${i + 1}`}
                                        value={item.name}
                                        label={item.name}
                                        defaultChecked={
                                          userAccessFields.includes(
                                            role.toLocaleLowerCase(),
                                          ) &&
                                          userRoleObject[role].includes(
                                            item.name,
                                          )
                                        }
                                        className="text-capitalize"
                                        {...register(`${role}.permission`)}
                                      />
                                    ))}
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ))
                    : null}
                </div>
              </CCol>
            </CRow>
            <CRow xs={12} className="my-3">
              <CCol md={6}>
                <CButton
                  component="input"
                  type="submit"
                  value="Update role"
                  disabled={loading}
                />
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default UserRolesEdit
