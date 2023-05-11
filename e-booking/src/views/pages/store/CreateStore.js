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

const CreateStore = () => {
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = async (data) => {
    await instance
      .post('/stock/store/add', data)
      .then(() => {
        toast.success('Store created')
      })
      .catch(() => {
        toast.error('error creating store')
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
                <strong> Create store </strong>
              </h2>
            </CCardHeader>
            <CCardBody>
              <CForm
                name="storeAddFrm"
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form"
              >
                <CCol md={6} className="mb-3">
                  <CFormLabel htmlFor="name"> Store name </CFormLabel>
                  <CFormInput
                    type="text"
                    name="name"
                    id="name"
                    placeholder="...materials store "
                    size="md"
                    {...register('name', { required: true })}
                  />
                </CCol>
                <CCol xs={12}>
                  <CButton
                    component="input"
                    type="submit"
                    value="Create store"
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

export default CreateStore
