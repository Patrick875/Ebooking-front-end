import React, { useEffect, useState } from 'react'
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
import { useForm } from 'react-hook-form'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

const ServiceAdd = () => {
  const { register, handleSubmit } = useForm()
  const [categories, setCategories] = useState([])

  const onSubmit = async (data) => {
    await instance
      .post('/services/add', data)
      .then(() => {
        toast.success('service added')
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }
  useEffect(() => {
    const getServiceCategories = async () => {
      await instance
        .get('/services/category/all')
        .then((res) => {
          setCategories(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getServiceCategories()
  }, [])
  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h2 className="text-center">
                <strong> Add Service </strong>
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
                  <CFormLabel htmlFor="category"> Select service</CFormLabel>
                  <CFormSelect
                    name="category"
                    id="category"
                    size="md"
                    className="mb-3"
                    aria-label="Room class"
                    {...register('category', { required: true })}
                  >
                    <option>-- Select -- </option>
                    {categories && categories.length !== 0
                      ? categories.map((category) => (
                          <option value={category.id} key={category.id}>
                            {category.name}
                          </option>
                        ))
                      : null}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="title"> Service title </CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="title"
                    id="title"
                    size="md"
                    required
                    {...register('name')}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="title"> Price </CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="price"
                    id="title"
                    size="md"
                    required
                    {...register('price')}
                  />
                </CCol>

                <CCol xs={12} className="text-center my-3">
                  <CButton
                    component="input"
                    type="submit"
                    value="Add Service"
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

export default ServiceAdd
