import { useEffect } from 'react'
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

function HallServiceEdit() {
  const selectedService = useSelector((state) => state.selection.selected) || {}
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { ...selectedService },
  })

  const onSubmit = async (data) => {
    data.id = selectedService.id
    await instance
      .put('/hall/services/update', data)
      .then(() => {
        toast.success('hall service updated!!!')
      })
      .catch(() => {
        toast.error('error updating hall service')
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
                <CFormLabel htmlFor="name"> Service name </CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="name"
                  id="title"
                  size="md"
                  defaultvalue={selectedService.name}
                  required
                  {...register('name')}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="name"> Service price in USD</CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="price"
                  id="title"
                  size="md"
                  defaultValue={selectedService.price}
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
                  rows="3"
                  {...register('description')}
                ></CFormTextarea>
              </CCol>
              <CCol xs={12} className="text-center my-3">
                <CButton
                  component="input"
                  type="submit"
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

export default HallServiceEdit
