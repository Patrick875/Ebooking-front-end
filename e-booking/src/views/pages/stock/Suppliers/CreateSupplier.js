import { useDispatch } from 'react-redux'
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

const CreateSupplier = () => {
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = async (data) => {
    await instance
      .post('/supply/create/supplier', data)
      .then((res) => {
        if (res && res.data && res.data.data) {
          toast.success('supplier created')
        }
      })
      .catch((er) => {
        console.log('err', er)
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
                <strong> Add supplier </strong>
              </h2>
            </CCardHeader>
            <CCardBody>
              <CForm
                name="supplierAddFrm"
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form"
              >
                <CRow className="d-flex justify-content-between">
                  <CCol md={6} className="mb-3">
                    <CFormLabel htmlFor="name"> Name </CFormLabel>
                    <CFormInput
                      type="text"
                      name="name"
                      id="name"
                      placeholder=" "
                      {...register('name')}
                      required
                    />
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <CFormLabel htmlFor="tel"> Tel </CFormLabel>
                    <CFormInput
                      type="text"
                      name="tel"
                      id="tel"
                      placeholder=" "
                      {...register('tel')}
                    />
                  </CCol>
                </CRow>
                <CCol xs={12}>
                  <CButton
                    component="input"
                    type="submit"
                    value="Add supplier"
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

export default CreateSupplier
