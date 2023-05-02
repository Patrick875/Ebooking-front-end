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

const ChangePassword = () => {
  const { register, handleSubmit, reset, watch } = useForm()
  const dispatch = useDispatch()
  const newPassword = watch('newPassword')
  const newPasswordConfirm = watch('confirmPassword')
  const onSubmit = async (data) => {
    await instance
      .post('/users/change-password', data)
      .then(() => {
        toast.success('password changed!')
      })
      .error(() => {
        toast.error('password update failed')
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
                      size="md"
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
                      size="md"
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
                      size="md"
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
