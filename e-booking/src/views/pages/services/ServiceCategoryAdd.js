import React from 'react'
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
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

const ServiceCategoryAdd = () => {
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    await instance
      .post('/services/category/add', data)
      .then(() => {
        toast.success('service category added')
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }
  //   const onManagerSubmit = async (data) => {
  //     await instance
  //       .post('/services/add', data)
  //       .then((res) => {
  //         console.log(res.data)
  //         toast.success('service created, price to added by admin')
  //       })
  //       .catch((err) => {
  //         toast.error(err.message)
  //       })
  //   }

  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h2 className="text-center">
                <strong> Add Service Category </strong>
              </h2>
            </CCardHeader>
            <CCardBody>
              <CForm
                className="row"
                name="serviceCategoryAddFrm"
                encType="multipart/form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <CCol md={6}>
                  <CFormLabel htmlFor="category">Name</CFormLabel>
                  <CFormInput
                    name="category_name"
                    id="category_name"
                    className="mb-3"
                    aria-label="Room class"
                    {...register('name', { required: true })}
                  />
                </CCol>

                <CCol xs={12} className="text-center my-3">
                  <CButton
                    component="input"
                    type="submit"
                    value="Add Category"
                  />
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default ServiceCategoryAdd
