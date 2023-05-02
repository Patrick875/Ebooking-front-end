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

const CreateTable = () => {
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = async (data) => {
    await instance
      .post('/tables/add', data)
      .then(() => {
        toast.success('table created')
      })
      .catch(() => {
        toast.error('table creation failed')
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
                <strong> Create Table </strong>
              </h2>
            </CCardHeader>
            <CCardBody>
              <CForm
                name="tableAddFrm"
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form"
              >
                <CCol md={6} className="mb-3">
                  <CFormLabel htmlFor="number"> Table number </CFormLabel>
                  <CFormInput
                    type="text"
                    name="number"
                    id="number"
                    placeholder="....table"
                    size="md"
                    {...register('number', { required: true })}
                  />
                </CCol>
                <CCol xs={12}>
                  <CButton
                    component="input"
                    type="submit"
                    value="Create table"
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

export default CreateTable
