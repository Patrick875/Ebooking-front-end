import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Typeahead } from 'react-bootstrap-typeahead'

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

import { instance, getTokenPromise } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

export default function RoomSell() {
  const [rooms, setRooms] = useState([])
  const { register, handleSubmit, watch, reset } = useForm()
  const [singleSelections, setSingleSelections] = useState([])
  const price = 0
  const onServiceSell = (data) => {
    console.log(data)
  }
  const onProductSell = (data) => {
    console.log(data)
  }
  const productPackages = [{}]
  const days = watch('quantity')
  const pItem = watch('pItem')
  const inputState = { minLength: 2 }
  useEffect(() => {
    const getRoomClasses = async () => {
      const res = await instance
        .get('/roomclass/all')
        .then((res) => {
          console.log(res.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    getRoomClasses()
  }, [])
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h2 className="text-center">
                <strong> Checkout Room </strong>
              </h2>
            </CCardHeader>
            <CCardBody>
              <CForm
                className="row"
                name="roomClassAddFrm"
                encType="multipart/form"
                onSubmit={handleSubmit(onProductSell)}
              >
                <CCol md={6}>
                  <CFormLabel htmlFor="title"> Room number </CFormLabel>

                  <Typeahead
                    {...inputState}
                    id="basic-typeahead-single"
                    labelKey="name"
                    onChange={setSingleSelections}
                    options={rooms}
                    placeholder="room number ..."
                    selected={singleSelections}
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="title"> days </CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="Number"
                    min={0}
                    name="quantity"
                    id="title"
                    required
                    {...register('days')}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel className="d-flex align-content-end flex-col">
                    Total :{' '}
                    <strong className="px-2">
                      {Number(days) * Number(price)}
                    </strong>
                  </CFormLabel>
                </CCol>

                <CCol xs={12} className="text-center my-3">
                  <CButton component="input" type="submit" value="Check out" />
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
