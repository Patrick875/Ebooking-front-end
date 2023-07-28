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
  CFormSelect,
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
        console.log('petit stock creation failed')
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
                <CRow>
                  <CCol md={6} className="mb-3">
                    <CFormLabel htmlFor="name"> Name </CFormLabel>
                    <CFormInput
                      type="text"
                      name="name"
                      id="name"
                      placeholder="...kitchen"
                      {...register('name', { required: true })}
                    />
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <CFormLabel htmlFor="name"> Type </CFormLabel>
                    <CFormSelect
                      name="type"
                      id="type"
                      {...register('selling', { required: true })}
                    >
                      <option value="selling">Selling</option>
                      <option value="non-selling">Non-selling</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

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
