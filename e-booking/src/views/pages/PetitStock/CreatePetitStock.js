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
  CRow,
} from '@coreui/react'

import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

const CreatePetitStock = () => {
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = async (data) => {
    await instance
      .post('/petit-stock/add', data)
      .then(() => {
        toast.success('petit stock created')
      })
      .catch(() => {
        toast.error('petit stock creation failed')
      })
    reset()
  }
  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h2>
                <strong> Create petit stock</strong>
              </h2>
            </CCardHeader>
            <CCardBody>
              <CForm
                name="createpetitstockf"
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form"
              >
                <CCol md={6} className="mb-3">
                  <CFormLabel htmlFor="name"> Name </CFormLabel>
                  <CFormInput
                    type="text"
                    name="name"
                    id="name"
                    placeholder="...kitchen"
                    size="md"
                    {...register('name', { required: true })}
                  />
                </CCol>
                <CCol xs={12}>
                  <CButton component="input" type="submit" value="Create" />
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default CreatePetitStock
