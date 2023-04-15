import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
} from '@coreui/react'

import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { instance, getTokenPromise } from 'src/API/AxiosInstance'

function HallServicesAdd() {
  let loggedInUser = useSelector((state) => state.auth.role)
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = async (data) => {
    await instance
      .post('/hall/services/add', data)
      .then(() => {
        toast.success('hall service create')
      })
      .catch((err) => {
        toast.error(err.message)
      })
    reset()
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> Add new hall product </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CForm name="roomAddFrm" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <CFormLabel htmlFor="hallName">Product name </CFormLabel>
                <CFormInput
                  type="text"
                  name="hallName"
                  id="hallName"
                  placeholder="product name"
                  size="md"
                  {...register('name', { required: true })}
                />
              </div>
              <div className="mb-3">
                <div>
                  <CFormLabel htmlFor="hallPrice"> Price in RWF </CFormLabel>
                  <CFormInput
                    type="text"
                    name="hallServicePrice "
                    id="hallServicePrice"
                    placeholder="price in RWF"
                    size="md"
                    {...register('price', { required: true })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="description"> Description </CFormLabel>
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
                    loggedInUser === 'controller' || loggedInUser !== 'admin'
                      ? 'disabled'
                      : ''
                  }`}
                  type="submit"
                  value="Add Hall Service"
                />
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default HallServicesAdd
