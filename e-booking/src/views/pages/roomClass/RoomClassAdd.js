import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
  CWidgetStatsF,
} from '@coreui/react'
import { cilArrowRight, cilClone } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'

const RoomClassAdd = () => {
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = async (data) => {
    await instance
      .post('/roomclass/add', data)
      .then(() => {
        toast.success('Room class created')
        reset()
      })
      .catch((err) => {
        toast.error(err.message, 'Room class creation failed')
        reset()
      })
  }

  return (
    <React.Fragment>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h2>
                <strong> Add room category</strong>
              </h2>
            </CCardHeader>
            <CCardBody>
              <CForm
                name="roomClassAddFrm"
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form"
              >
                <div className="mb-3">
                  <CFormLabel htmlFor="name"> Class name </CFormLabel>
                  <CFormInput
                    type="text"
                    name="name"
                    id="name"
                    placeholder="VIP"
                    size="sm"
                    required
                    {...register('name', { required: true })}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="price"> Class Price in USD </CFormLabel>
                  <CFormInput
                    type="number"
                    min={0}
                    name="price"
                    id="price"
                    placeholder="price in USD"
                    required
                    {...register('price')}
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="description"> Description </CFormLabel>
                  <CFormTextarea
                    name="description"
                    id="description"
                    rows="3"
                    {...register('description', { required: true })}
                  ></CFormTextarea>
                </div>
                <CCol xs={12}>
                  <CButton
                    component="input"
                    type="submit"
                    value="Add room Class"
                  />
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </React.Fragment>
  )
}

export default RoomClassAdd
