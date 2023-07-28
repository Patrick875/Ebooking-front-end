import React, { useEffect, useState } from 'react'
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
  CFormTextarea,
  CRow,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'

const FormControl = () => {
  let loggedInUser = useSelector((state) => state.auth.user.Role.name)
  const { register, handleSubmit, reset } = useForm()
  const [roomClasses, setRoomClasses] = useState([])

  const onSubmit = async (data) => {
    await instance
      .post('/room/add', data)
      .then(() => {
        toast.success('Room created')
      })
      .catch((err) => {
        console.log('Room  create failed')
      })
    reset()
  }
  useEffect(() => {
    const getRoomClasses = async () => {
      await instance
        .get('/roomclass/all')
        .then((res) => {
          setRoomClasses(res.data.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    getRoomClasses()
  }, [])

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
                <CFormLabel htmlFor="roomNumber"> Room number </CFormLabel>
                <CFormInput
                  type="text"
                  name="roomNumber"
                  id="roomNumber"
                  placeholder="V10MT"
                  {...register('name')}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="roomClassId"> Room Class </CFormLabel>
                <CFormSelect
                  name="roomClassId"
                  id="roomClassId"
                  className="mb-3"
                  aria-label="Room class"
                  {...register('roomClassId', { required: true })}
                >
                  <option>-- Select -- </option>
                  {roomClasses && roomClasses.length !== 0
                    ? roomClasses.map((e) => {
                        return (
                          <option value={e.id} key={e.id}>
                            {' '}
                            {e.name}{' '}
                          </option>
                        )
                      })
                    : null}
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="description"> Description </CFormLabel>
                <CFormTextarea
                  name="description"
                  id="description"
                  rows="3"
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
                  value="Add room"
                />
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default FormControl
