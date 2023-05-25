import React, { useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function ServiceEdit() {
  const selectedService = useSelector((state) => state.selection.selected) || {}
  const { register, reset, getValues } = useForm({
    defaultValues: { ...selectedService },
  })
  const navigate = useNavigate()
  const onServiceUpdate = async () => {
    let data = getValues()
    data.id = selectedService.id
    console.log('...STAFF STAFF...', data)
    await instance
      .put('/services/update', data)
      .then(() => {
        toast.success('Service updated successfully')
        navigate(-1)
      })
      .catch((err) => {
        toast.error('error updating service', err)
      })
    reset()
  }

  useEffect(() => {}, [])
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2 className="text-center">
              <strong> Edit Service </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CForm
              className="row"
              name="serviceEditFrm"
              encType="multipart/form"
            >
              <CCol md={6}>
                <CFormLabel htmlFor="name"> Name </CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="name"
                  id="title"
                  defaultValue={selectedService.name}
                  required
                  {...register('name')}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="name"> Price</CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="price"
                  id="title"
                  defaultValue={selectedService.price}
                  required
                  {...register('price')}
                />
              </CCol>
              <CCol xs={12} className="text-center my-3">
                <CButton
                  component="input"
                  onClick={() => {
                    return onServiceUpdate()
                  }}
                  value=" Update service"
                />
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ServiceEdit
