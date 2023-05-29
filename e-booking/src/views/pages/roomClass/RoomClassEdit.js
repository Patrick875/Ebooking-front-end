import React from 'react'
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
  CFormTextarea,
  CRow,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { instance, getTokenPromise } from 'src/API/AxiosInstance'

const RoomClassEdit = () => {
  let loggedInUser = useSelector((state) => state.auth.user.Role.name)
  const { register, handleSubmit, reset } = useForm()
  const selectedRoomClass = useSelector((state) => state.selection.selected)
  const onSubmit = async (data) => {
    data.id = selectedRoomClass.id

    await instance
      .put('/roomclass/update', data)
      .then((res) => {
        toast.success('Room class updated')
      })
      .catch((err) => {
        toast.error(err.message)
        toast.error('Room class update failed')
      })

    reset()
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> Add new room </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CForm name="roomAddFrm" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <CFormLabel htmlFor="roomNumber"> Room Class Name </CFormLabel>
                <CFormInput
                  type="text"
                  name="roomNumber"
                  id="roomNumber"
                  defaultValue={selectedRoomClass.name}
                  {...register('name')}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="roomNumber"> Room Class Price </CFormLabel>
                <CFormInput
                  type="number"
                  name="roomClassPrice"
                  id="roomClassPrice"
                  defaultValue={selectedRoomClass.price}
                  {...register('price')}
                />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="description"> Description </CFormLabel>
                <CFormTextarea
                  name="description"
                  id="description"
                  rows="3"
                  defaultValue={selectedRoomClass.description}
                  {...register('description')}
                ></CFormTextarea>
              </div>
              <CCol xs={12}>
                <CButton
                  component="input"
                  className={`${
                    loggedInUser === 'controller' ? 'disabled' : ''
                  }`}
                  type="submit"
                  value="Update Room Class"
                />
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default RoomClassEdit
