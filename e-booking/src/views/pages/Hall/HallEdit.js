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
  CFormTextarea,
  CRow,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

function HallEdit() {
  const selectedHall = useSelector((state) => state.selection.selected) || {}
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { ...selectedHall },
  })

  const onSubmit = async (data) => {
    console.log(data)
    await instance
      .put('/halls/update', data)
      .then(() => {
        toast.success('Hall updated')
      })
      .catch(() => {
        console.log('error updating hall')
      })
    reset()
    //roomClass.push(formData);
  }

  useEffect(() => {}, [])
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2 className="text-center">
              <strong> Edit Hall Service </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CForm
              className="row"
              name="roomClassAddFrm"
              encType="multipart/form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <CCol md={6}>
                <CFormLabel htmlFor="name"> Name </CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="name"
                  id="title"
                  defaultValue={selectedHall.name}
                  required
                  {...register('name')}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="size">Size</CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="size"
                  id="title"
                  defaultValue={selectedHall.size ? selectedHall.size : ''}
                  required
                  {...register('size')}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="name"> Hall price in USD</CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="price"
                  id="title"
                  defaultValue={selectedHall.price}
                  required
                  {...register('price')}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="description">
                  Service description{' '}
                </CFormLabel>
                <CFormTextarea
                  name="description"
                  id="description"
                  defaultValue={selectedHall.description}
                  rows="3"
                  {...register('description')}
                ></CFormTextarea>
              </CCol>
              <CCol xs={12} className="text-center my-3">
                <CButton component="input" type="submit" value=" Update Hall" />
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default HallEdit
