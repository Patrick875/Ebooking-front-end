import React, { useState } from 'react'
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
  CFormTextarea,
  CRow,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { instance, getTokenPromise } from 'src/API/AxiosInstance'

function HallAdd() {
  let loggedInUser = useSelector((state) => state.auth.role)

  const { register, handleSubmit, reset } = useForm()
  const onSubmit = async (data) => {
    await instance
      .post('/halls/add', data)
      .then((res) => {
        toast.success('Hall created')
        reset()
      })
      .catch((err) => {
        console.log('Hall create failed', err.message)
        reset()
      })
  }
  // useEffect(() => {}, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> Add new hall </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CForm name="roomAddFrm" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <CFormLabel htmlFor="hallName"> Hall name </CFormLabel>
                <CFormInput
                  type="text"
                  name="hallName"
                  id="hallName"
                  placeholder="hall name"
                  {...register('name', { required: true })}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="hallCapacity"> Capacity </CFormLabel>
                <CFormInput
                  type="text"
                  name="hallCapacity"
                  id="hallCapacity"
                  placeholder="maximum number of people"
                  {...register('size', { required: true })}
                />
              </div>
              <div className="mb-3">
                <div>
                  <CFormLabel htmlFor="hallPrice"> Price in RWF </CFormLabel>
                  <CFormInput
                    type="text"
                    name="hallPrice "
                    id="hallPrice"
                    placeholder="price in RWF"
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
                    loggedInUser === 'controller' ? 'disabled' : ''
                  }`}
                  type="submit"
                  value="Add Hall"
                />
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default HallAdd
