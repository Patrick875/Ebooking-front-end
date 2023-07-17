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

const ChangePassword = () => {
  const { register, handleSubmit, reset, watch } = useForm()
  const newPassword = watch('newPassword')
  const newPasswordConfirm = watch('confirmPassword')
  const onSubmit = async (data) => {
    await instance
      .post('/changePassword', data)
      .then(() => {
        toast.success('password changed!')
      })
      .catch((err) => {
        toast.error('password update failed', err)
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
                <strong> Change Password </strong>
              </h2>
            </CCardHeader>
            <CCardBody>
              <CForm
                name="roomClassAddFrm"
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form"
              >
                <CRow>
                  <CCol md={6} className="mb-3">
                    <CFormLabel htmlFor="oldPassword">
                      {' '}
                      Old password{' '}
                    </CFormLabel>
                    <CFormInput
                      type="password"
                      name="oldPassword"
                      id="oldPassword"
                      placeholder="*********"
                      {...register('password', { required: true })}
                    />
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <CFormLabel htmlFor="newPassword">
                      {' '}
                      New password{' '}
                    </CFormLabel>
                    <CFormInput
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      placeholder="**********"
                      {...register('newPassword', { required: true })}
                    />
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <CFormLabel htmlFor="newPasswordConfirm">
                      {' '}
                      Confirm new password{' '}
                    </CFormLabel>
                    <CFormInput
                      type="password"
                      name="newPasswordConfirm"
                      id="newPasswordConfirm"
                      placeholder="**********"
                      {...register('confirmPassword', { required: true })}
                    />
                  </CCol>
                </CRow>

                {newPassword && newPasswordConfirm ? (
                  newPassword !== newPasswordConfirm ? (
                    <p className="fs-6 text-danger">Passwords don't match</p>
                  ) : null
                ) : null}
                <CCol xs={12}>
                  <CButton
                    disabled={
                      !(
                        newPassword &&
                        newPasswordConfirm &&
                        newPassword === newPasswordConfirm
                      )
                    }
                    component="input"
                    type="submit"
                    value="Change password"
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

export default ChangePassword
