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
import { instance } from 'src/API/AxiosInstance'
import _nav from 'src/_nav'

function UserRolesAdd() {
  const { register, handleSubmit, watch, reset } = useForm()

  let items = _nav
  const [loading, setLoading] = useState(false)
  let access = watch('access')
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
    console.log('data12', data)
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

    data = { name: data.name, access: data.access }

    setLoading(true)

    await instance
      .post('/roles/add', data)
      .then(() => {
        toast.success('role created')
        reset()
      })
      .catch(() => {
        toast.error('role not created')
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
                            id={`Access${i + 1}`}
                            value={role}
                            label={role}
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
                                        id={`"permission${i + 1}`}
                                        value={item.name}
                                        label={item.name}
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
                  value="Create role"
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

export default UserRolesAdd
